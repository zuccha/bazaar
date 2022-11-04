import { R, ResultVoid } from "../utils/result";
import Configurable, { ConfigurableBag } from "./configurable";
import EditorCollection from "./editor-collection";
import OriginalRom from "./original-rom";
import ToolCollection from "./tool-collection";

const ErrorCode = {
  ...Configurable.ErrorCode,
  ConfigNotFound: "Resource.ConfigNotFound",
  DirectoryNotFound: "Resource.DirectoryNotFound",
  SnapshotTargetExists: "Resource.SnapshotTargetExists",
};

export type ResourceBag = {
  originalRom: OriginalRom;
  editors: EditorCollection;
  tools: ToolCollection;
} & ConfigurableBag;

export default abstract class Resource<
  Config extends Record<string | number | symbol, unknown>,
> extends Configurable<Config> {
  static ErrorCode = ErrorCode;

  protected bag: ResourceBag;

  constructor(directoryPath: string, bag: ResourceBag) {
    super(directoryPath, bag);
    this.bag = bag;
  }

  protected get originalRom(): OriginalRom {
    return this.bag.originalRom;
  }

  protected get editors(): EditorCollection {
    return this.bag.editors;
  }

  protected get tools(): ToolCollection {
    return this.bag.tools;
  }

  async validate(): Promise<ResultVoid> {
    const scope = this.scope("validate");

    this.logger.start(`Checking if directory exists`);
    const exists = await this.exists();
    if (!exists) {
      this.logger.failure();
      const message = `Directory "${this.path()}" does not exist`;
      return R.Error(scope, message, ErrorCode.DirectoryNotFound);
    }
    this.logger.success();

    this.logger.start(`Checking if config exists`);
    const configIsFile = await this.fs.isFile(this.configPath);
    if (!configIsFile) {
      this.logger.failure();
      const message = `Config "${this.configPath}" does not exist`;
      return R.Error(scope, message, ErrorCode.ConfigNotFound);
    }
    this.logger.success();

    return R.Void;
  }

  async snapshot(
    targetResource: Resource<Config>,
    config?: Partial<Config>,
    partialOptions?: Partial<{ force: boolean; config: Partial<Config> }>,
  ): Promise<ResultVoid> {
    const scope = this.scope("snapshot");
    let result: ResultVoid;

    const options = { force: false, ...partialOptions };

    this.logger.start("Verifying that source is valid");
    result = await this.validate();
    if (R.isError(result)) {
      this.logger.failure();
      return result;
    }
    this.logger.success();

    this.logger.start(`Checking if target does't already exist`);
    const targetProjectExists = await targetResource.exists();
    if (targetProjectExists) {
      this.logger.failure();
      if (!options.force) {
        const message = `Target "${targetResource.path()}" already exists`;
        return R.Error(scope, message, ErrorCode.SnapshotTargetExists);
      }

      this.logger.start(`Removing target project`);
      result = await targetResource.removeDirectory();
      if (R.isError(result)) {
        this.logger.failure();
        const message = `Failed to remove target directory "${targetResource.path()}"`;
        return R.Stack(result, scope, message, ErrorCode.Generic);
      }
      this.logger.success();
    } else {
      this.logger.success();
    }

    this.logger.start("Copying config");
    result = await this.fs.copyFile(this.configPath, targetResource.configPath);
    if (R.isError(result)) {
      this.logger.failure();
      const message = `Failed to copy config from "${this.configPath}" to "${targetResource.configPath}"`;
      return R.Stack(result, scope, message, ErrorCode.Generic);
    }
    this.logger.success();

    if (config) {
      this.logger.start("Updating config");
      result = await targetResource.updateConfig(config);
      if (R.isError(result)) {
        this.logger.failure();
        return result;
      }
      this.logger.success();
    }

    return R.Void;
  }
}
