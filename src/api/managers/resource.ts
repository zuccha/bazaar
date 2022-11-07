import { z } from "zod";
import { R, Result, ResultVoid } from "../utils/result";
import SemVer from "../utils/sem-ver";
import Configurable, {
  ConfigurableContext,
  ConfigurableConfigDefault,
  ConfigurableErrorCodes,
  ConfigurableExtraErrorCode,
  ConfigurableExtraErrorCodeDefault,
} from "./configurable";
import { DirectoryErrorCodes } from "./directory";
import EditorCollection from "./editor-collection";
import OriginalRom from "./original-rom";
import ToolCollection from "./tool-collection";

export const ResourceConfigSchema = z.object({
  authors: z.array(z.string()),
  version: z.string(),
});

export type ResourceConfig = z.infer<typeof ResourceConfigSchema>;

export enum ResourceErrorCode {
  Internal,
  DirectoryNotFound,
  SnapshotTargetExists,
  VersionNotValid,
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
  ValidateInputConfig: never;

  GetMetadata:
    | ConfigurableErrorCodes["LoadConfig"]
    | ResourceErrorCodes["Validate"];
  UpdateMetadata:
    | ConfigurableErrorCodes["UpdateConfig"]
    | ResourceErrorCodes["Validate"]
    | ResourceErrorCodes["ValidateInputConfig"];

  IncreaseMajorVersion: ResourceErrorCodes["IncreaseVersion"];
  IncreaseMinorVersion: ResourceErrorCodes["IncreaseVersion"];
  IncreasePatchVersion: ResourceErrorCodes["IncreaseVersion"];
  IncreaseVersion:
    | ConfigurableErrorCodes["LoadConfig"]
    | ConfigurableErrorCodes["UpdateConfig"]
    | ResourceErrorCodes["Validate"]
    | ResourceErrorCode.VersionNotValid;
};

export type ResourceContext = ConfigurableContext & {
  originalRom: OriginalRom;
  editors: EditorCollection;
  tools: ToolCollection;
};

export type ResourceConfigDefault = ConfigurableConfigDefault;

export type ResourceExtraErrorCode = ConfigurableExtraErrorCode & {
  Snapshot: string | number;
  Validate: string | number;
  ValidateInputConfig: string | number;
};

export type ResourceExtraErrorCodeDefault =
  ConfigurableExtraErrorCodeDefault & {
    Snapshot: never;
    Validate: never;
    ValidateInputConfig: never;
  };

export default abstract class Resource<
  Config extends ResourceConfig,
  ExtraErrorCode extends ResourceExtraErrorCode = ResourceExtraErrorCodeDefault,
> extends Configurable<Config, ExtraErrorCode, ResourceContext> {
  protected label = "resource";

  constructor(directoryPath: string, context: ResourceContext) {
    super(directoryPath, context);
    this.context = context;
  }

  protected get originalRom(): OriginalRom {
    return this.context.originalRom;
  }

  protected get editors(): EditorCollection {
    return this.context.editors;
  }

  protected get tools(): ToolCollection {
    return this.context.tools;
  }

  protected validateInputConfig(
    // Argument needed for method overload.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    inputConfig?: Partial<Config>,
  ): Promise<
    ResultVoid<
      | ResourceErrorCodes["ValidateInputConfig"]
      | ExtraErrorCode["ValidateInputConfig"]
    >
  > {
    return Promise.resolve(R.Void);
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

    this.logger.start(`Checking if config is valid`);
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
      | ExtraErrorCode["ValidateInputConfig"]
    >
  > {
    const scope = this.scope("snapshot");

    const options = { force: false, ...partialOptions };

    this.logger.start(`Verifying that ${this.label} is valid`);
    const validateResult = await this.validate();
    if (R.isError(validateResult)) {
      this.logger.failure();
      return validateResult;
    }
    this.logger.success();

    this.logger.start("Verifying input config");
    const validateInputConfigResult = await this.validateInputConfig(config);
    if (R.isError(validateInputConfigResult)) {
      this.logger.failure();
      return validateInputConfigResult;
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

      this.logger.start(`Removing target ${this.label}`);
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
    this.logger.start(`Verifying that ${this.label} is valid`);
    const validateResult = await this.validate();
    if (R.isError(validateResult)) {
      this.logger.failure();
      return validateResult;
    }
    this.logger.success();

    this.logger.start(`Removing ${this.label} directory`);
    const removeDirectoryResult = await this.removeDirectory();
    if (R.isError(removeDirectoryResult)) {
      this.logger.failure();
      return removeDirectoryResult;
    }
    this.logger.success();

    return R.Void;
  }

  async getMetadata(): Promise<
    Result<
      Config,
      ResourceErrorCodes["GetMetadata"] | ExtraErrorCode["Validate"]
    >
  > {
    this.logger.start("Verifying that project is valid");
    const result = await this.validate();
    if (R.isError(result)) {
      this.logger.failure();
      return result;
    }
    this.logger.success();

    return this.loadConfig();
  }

  async updateMetadata(
    metadata: Partial<Config>,
  ): Promise<
    ResultVoid<
      ResourceErrorCodes["UpdateMetadata"] | ExtraErrorCode["Validate"]
    >
  > {
    this.logger.start("Verifying that project is valid");
    const validateResult = await this.validate();
    if (R.isError(validateResult)) {
      this.logger.failure();
      return validateResult;
    }
    this.logger.success();

    this.logger.start("Validating input config");
    const validateMetadataResult = await this.validateInputConfig(metadata);
    if (R.isError(validateMetadataResult)) {
      this.logger.failure();
      return validateMetadataResult;
    }
    this.logger.success();

    return this.updateConfig(metadata);
  }

  private async _increaseVersion(
    scope: string,
    increase: (version: string) => Result<string>,
  ): Promise<
    ResultVoid<
      ResourceErrorCodes["IncreaseVersion"] | ExtraErrorCode["Validate"]
    >
  > {
    this.logger.start(`Verifying that ${this.label} is valid`);
    const validateResult = await this.validate();
    if (R.isError(validateResult)) {
      this.logger.failure();
      return validateResult;
    }
    this.logger.success();

    this.logger.start("Reading metadata");
    const configResult = await this.loadConfig();
    if (R.isError(configResult)) {
      this.logger.failure();
      return configResult;
    }
    this.logger.success();

    this.logger.start("Incrementing version automatically");
    const versionResult = increase(configResult.data.version);
    if (R.isError(versionResult)) {
      this.logger.failure();
      const message = `The version "${configResult.data.version}" of the ${this.label} cannot be incremented automatically`;
      return R.Error(scope, message, ResourceErrorCode.VersionNotValid);
    }
    this.logger.success();

    this.logger.start("Writing metadata");
    // ? `{ version: string }` cannot be assigned to `Partial<Config>` because
    // ? theoretically one could extend `Config` to have a more strict type for
    // ? `version` (e.g., `{ version: "1" | "2" }`). However, we are going to
    // ? ignore this scenario and assume `version` is always a generic string.
    const config = { version: versionResult.data } as Partial<Config>;
    const updateConfigResult = await this.updateConfig(config);
    if (R.isError(updateConfigResult)) {
      this.logger.failure();
      return updateConfigResult;
    }
    this.logger.success();

    return R.Void;
  }

  async increaseMajorVersion(): Promise<
    ResultVoid<
      ResourceErrorCodes["IncreaseMajorVersion"] | ExtraErrorCode["Validate"]
    >
  > {
    const scope = this.scope("increaseMajorVersion");
    return this._increaseVersion(scope, SemVer.increaseMajor);
  }

  async increaseMinorVersion(): Promise<
    ResultVoid<
      ResourceErrorCodes["IncreaseMinorVersion"] | ExtraErrorCode["Validate"]
    >
  > {
    const scope = this.scope("increaseMinorVersion");
    return this._increaseVersion(scope, SemVer.increaseMinor);
  }

  async increasePatchVersion(): Promise<
    ResultVoid<
      ResourceErrorCodes["IncreasePatchVersion"] | ExtraErrorCode["Validate"]
    >
  > {
    const scope = this.scope("increasePatchVersion");
    return this._increaseVersion(scope, SemVer.increasePatch);
  }
}
