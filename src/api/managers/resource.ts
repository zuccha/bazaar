import { R, ResultVoid } from "../utils/result";
import Configurable, {
  ConfigurableBag,
  ConfigurableErrorCodes,
} from "./configurable";
import { DirectoryErrorCodes } from "./directory";
import EditorCollection from "./editor-collection";
import OriginalRom from "./original-rom";
import ToolCollection from "./tool-collection";

export enum ResourceErrorCode {
  Internal,
  DirectoryNotFound,
  SnapshotTargetExists,
}

export type ResourceErrorCodes = {
  Remove:
    | ResourceErrorCodes["Validate"]
    | DirectoryErrorCodes["RemoveDirectory"];
  Snapshot:
    | ResourceErrorCodes["Validate"]
    | ResourceErrorCode.SnapshotTargetExists
    | ResourceErrorCode.Internal;
  Validate:
    | ConfigurableErrorCodes["ValidateConfig"]
    | ResourceErrorCode.DirectoryNotFound;
};

export type ResourceBag = {
  originalRom: OriginalRom;
  editors: EditorCollection;
  tools: ToolCollection;
} & ConfigurableBag;

export default abstract class Resource<
  Config extends Record<string | number | symbol, unknown>,
  ExtraErrorCode extends {
    Snapshot: string | number;
    Validate: string | number;
  } = {
    Snapshot: never;
    Validate: never;
  },
> extends Configurable<Config> {
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

  async validate(): Promise<
    ResultVoid<ResourceErrorCodes["Validate"] | ExtraErrorCode["Validate"]>
  > {
    const scope = this.scope("validate");

    this.logger.start(`Checking if directory exists`);
    const exists = await this.exists();
    if (!exists) {
      this.logger.failure();
      const message = `Directory "${this.path()}" does not exist`;
      return R.Error(scope, message, ResourceErrorCode.DirectoryNotFound);
    }
    this.logger.success();

    this.logger.start(`Checking if config exists`);
    const validateConfigResult = await this.validateConfig();
    if (R.isError(validateConfigResult)) {
      this.logger.failure();
      return validateConfigResult;
    }
    this.logger.success();

    return R.Void;
  }

  async snapshot(
    targetResource: Resource<Config, ExtraErrorCode>,
    config?: Partial<Config>,
    partialOptions?: Partial<{ force: boolean; config: Partial<Config> }>,
  ): Promise<
    ResultVoid<
      | ResourceErrorCodes["Snapshot"]
      | ExtraErrorCode["Snapshot"]
      | ExtraErrorCode["Validate"]
    >
  > {
    const scope = this.scope("snapshot");

    const options = { force: false, ...partialOptions };

    this.logger.start("Verifying that source is valid");
    const validateResult = await this.validate();
    if (R.isError(validateResult)) {
      this.logger.failure();
      return validateResult;
    }
    this.logger.success();

    this.logger.start(`Checking if target does't already exist`);
    const targetProjectExists = await targetResource.exists();
    if (targetProjectExists) {
      this.logger.failure();
      if (!options.force) {
        const message = `Target "${targetResource.path()}" already exists`;
        return R.Error(scope, message, ResourceErrorCode.SnapshotTargetExists);
      }

      this.logger.start(`Removing target project`);
      const removeTargetDirectoryResult =
        await targetResource.removeDirectory();
      if (R.isError(removeTargetDirectoryResult)) {
        this.logger.failure();
        const message = `Failed to remove target directory "${targetResource.path()}"`;
        return R.Stack(
          removeTargetDirectoryResult,
          scope,
          message,
          ResourceErrorCode.Internal,
        );
      }
      this.logger.success();
    } else {
      this.logger.success();
    }

    this.logger.start("Copying config");
    const copyConfigResult = await this.fs.copyFile(
      this.configPath,
      targetResource.configPath,
    );
    if (R.isError(copyConfigResult)) {
      this.logger.failure();
      const message = `Failed to copy config from "${this.configPath}" to "${targetResource.configPath}"`;
      return R.Stack(
        copyConfigResult,
        scope,
        message,
        ResourceErrorCode.Internal,
      );
    }
    this.logger.success();

    if (config) {
      this.logger.start("Updating config");
      const updateTargetConfigResult = await targetResource.updateConfig(
        config,
      );
      if (R.isError(updateTargetConfigResult)) {
        this.logger.failure();
        return R.Stack(
          updateTargetConfigResult,
          scope,
          "Failed to update config",
          ResourceErrorCode.Internal,
        );
      }
      this.logger.success();
    }

    return R.Void;
  }

  async remove(): Promise<
    ResultVoid<ResourceErrorCodes["Remove"] | ExtraErrorCode["Validate"]>
  > {
    this.logger.start("Verifying that project is valid");
    const validateResult = await this.validate();
    if (R.isError(validateResult)) {
      this.logger.failure();
      return validateResult;
    }
    this.logger.success();

    this.logger.start("Removing project directory");
    const removeDirectoryResult = await this.removeDirectory();
    if (R.isError(removeDirectoryResult)) {
      this.logger.failure();
      return removeDirectoryResult;
    }
    this.logger.success();

    return R.Void;
  }
}
