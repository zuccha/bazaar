import { R, Result, ResultVoid } from "../../utils/result";
import DirectoryManager from "../directory-manager";

export type ToolInfo = {
  name: string;
  supportedVersion: string;
  installedVersion: string | undefined;
  installationStatus: "not-installed" | "installed" | "deprecated";
};

const ErrorCode = {
  FailedToCreateMainDirectory: "Tool.FailedToCreateMainDirectory",
  FailedToCreateVersionDirectory: "Tool.FailedToCreateVersionDirectory",
  FailedToExtractArchive: "Tool.FailedToExtractArchive",
  FailedToReadToolDirectoryContent: "Tool.FailedToReadToolDirectoryContent",
  FailedToRemoveArchive: "Tool.FailedToRemoveArchive",
  FailedToRemoveMainDirectory: "Tool.FailedToRemoveMainDirectory",
  FailedToRemoveVersionDirectory: "Tool.FailedToRemoveVersionDirectory",
  ToolAlreadyInstalled: "Tool.ToolAlreadyInstalled",
  ToolIsUpToDate: "Tool.ToolIsUpToDate",
  ToolNotInstalled: "Tool.ToolNotInstalled",
  Generic: "Tool.Generic",
};

export default abstract class Tool extends DirectoryManager {
  static ErrorCode = ErrorCode;

  protected abstract displayName: string;
  protected abstract exeName: string;
  protected abstract downloadUrl: string;
  protected abstract supportedVersion: string;

  async list(): Promise<Result<ToolInfo>> {
    const scope = this.scope("list");

    const baseInfo = {
      name: this.displayName,
      supportedVersion: this.supportedVersion,
    };

    this.logger.start(`Checking if ${this.displayName} directory exists`);
    const toolDirectoryPathExists = await this.exists();
    if (!toolDirectoryPathExists) {
      this.logger.failure();
      return R.Ok({
        ...baseInfo,
        installedVersion: undefined,
        installationStatus: "not-installed",
      });
    }
    this.logger.success();

    this.logger.start(`Collecting ${this.displayName} directory information`);
    const toolDirectoryInfoResult = await this.getDirectoryInfo();
    if (R.isError(toolDirectoryInfoResult)) {
      this.logger.failure();
      const message = "Failed to read directory content";
      return R.Stack(
        toolDirectoryInfoResult,
        scope,
        message,
        ErrorCode.FailedToReadToolDirectoryContent,
      );
    }
    this.logger.success();

    const { directoryNames } = toolDirectoryInfoResult.data;
    if (directoryNames.length === 0) {
      return R.Ok({
        ...baseInfo,
        installedVersion: undefined,
        installationStatus: "not-installed",
      });
    }

    if (directoryNames.includes(this.supportedVersion)) {
      return R.Ok({
        ...baseInfo,
        installedVersion: this.supportedVersion,
        installationStatus: "installed",
      });
    }

    return R.Ok({
      ...baseInfo,
      installedVersion: directoryNames[0],
      installationStatus: "deprecated",
    });
  }

  async install(
    partialOptions?: Partial<{
      force: boolean;
      ignoreIfAlreadyInstalled: boolean;
    }>,
  ): Promise<ResultVoid> {
    const scope = this.scope("install");
    let result: ResultVoid;

    const options = {
      force: false,
      ignoreIfAlreadyInstalled: false,
      ...partialOptions,
    };

    this.logger.start(`Checking if ${this.displayName} is already installed`);
    const toolDirectoryPathExists = await this.exists();
    if (toolDirectoryPathExists) {
      if (options.ignoreIfAlreadyInstalled) {
        this.logger.success();
        return R.Void;
      }

      if (!options.force) {
        this.logger.failure();
        return R.Error(
          scope,
          `${this.displayName} is already installed`,
          ErrorCode.ToolAlreadyInstalled,
        );
      }

      this.logger.success();

      this.logger.start("Removing old versions");
      result = await this.removeDirectory();
      if (R.isError(result)) {
        this.logger.failure();
        return R.Stack(
          result,
          scope,
          `Failed to remove "${this.displayName}" directory`,
          ErrorCode.FailedToRemoveMainDirectory,
        );
      }
      this.logger.success();
    }

    this.logger.start(`Creating ${this.displayName} directory`);
    result = await this.createDirectory();
    if (R.isError(result)) {
      this.logger.failure();
      return R.Stack(
        result,
        scope,
        `Failed to create "${this.displayName}" directory`,
        ErrorCode.FailedToCreateMainDirectory,
      );
    }
    this.logger.success();

    this.logger.start(`Downloading ${this.displayName}`);
    const toolZipFilePath = this.path(`${this.supportedVersion}.zip`);
    result = await this.fs.downloadFile(toolZipFilePath, this.downloadUrl);
    if (R.isError(result)) {
      this.logger.failure();
      return R.Stack(
        result,
        scope,
        `Failed to download ${this.displayName} from SMWCentral`,
        ErrorCode.FailedToRemoveMainDirectory,
      );
    }
    this.logger.success();

    this.logger.start(`Extracting ${this.displayName} archive`);
    const toolVersionDirectoryPath = this.path(this.supportedVersion);
    result = await this.fs.unzipFile(
      toolZipFilePath,
      toolVersionDirectoryPath,
      { collapseSingleDirectoryArchive: true },
    );
    if (R.isError(result)) {
      this.logger.failure();
      return R.Stack(
        result,
        scope,
        `Failed to extract ${this.displayName} archive`,
        ErrorCode.FailedToRemoveMainDirectory,
      );
    }
    this.logger.success();

    this.logger.start(`Removing ${this.displayName} archive`);
    result = await this.fs.removeFile(toolZipFilePath);
    if (R.isError(result)) {
      this.logger.failure();
      return R.Stack(
        result,
        scope,
        `Failed to remove "${this.displayName}" archive`,
        ErrorCode.FailedToRemoveArchive,
      );
    }
    this.logger.success();

    return R.Void;
  }

  async uninstall(
    partialOptions?: Partial<{
      ignoreIfNotInstalled: boolean;
    }>,
  ): Promise<ResultVoid> {
    const scope = this.scope("uninstall");

    const options = { ignoreIfNotInstalled: false, ...partialOptions };

    this.logger.start(`Checking if ${this.displayName} is installed`);
    const toolDirectoryPathExists = await this.exists();
    if (options.ignoreIfNotInstalled && !toolDirectoryPathExists) {
      this.logger.stop();
      return R.Void;
    }

    if (!toolDirectoryPathExists) {
      this.logger.failure();
      return R.Error(
        scope,
        `${this.displayName} is not installed`,
        ErrorCode.ToolNotInstalled,
      );
    }
    this.logger.success();

    this.logger.start(`Removing ${this.displayName} directory`);
    const result = await this.removeDirectory();
    if (R.isError(result)) {
      return R.Error(
        scope,
        `Failed to remove ${this.displayName} directory`,
        ErrorCode.Generic,
      );
    }
    this.logger.success();

    return R.Void;
  }

  async update(
    partialOptions?: Partial<{
      ignoreIfNotInstalled: boolean;
      ignoreIfUpToDate: boolean;
    }>,
  ): Promise<ResultVoid> {
    const scope = this.scope("update");

    const options = {
      ignoreIfNotInstalled: false,
      ignoreIfUpToDate: false,
      ...partialOptions,
    };

    const toolVersionDirectoryPath = this.path(this.supportedVersion);

    this.logger.start(`Checking if ${this.displayName} is up to date`);
    const toolVersionDirectoryPathExists = await this.fs.exists(
      toolVersionDirectoryPath,
    );
    if (toolVersionDirectoryPathExists) {
      if (options.ignoreIfUpToDate) {
        this.logger.success();
        return R.Void;
      }
      this.logger.failure();
      return R.Error(
        scope,
        `${this.displayName} is up to date`,
        ErrorCode.ToolIsUpToDate,
      );
    }
    this.logger.failure();

    this.logger.start(
      `Checking if another ${this.displayName} version is installed`,
    );
    const toolDirectoryPathExists = await this.exists();
    if (!toolDirectoryPathExists) {
      if (options.ignoreIfNotInstalled) {
        this.logger.failure();
        return R.Void;
      }
      this.logger.failure();
      return R.Error(
        scope,
        `${this.displayName} is not installed`,
        ErrorCode.ToolNotInstalled,
      );
    }
    this.logger.success();

    const result = await this.install({ force: true });
    if (R.isError(result)) {
      this.logger.failure();
      return R.Stack(
        result,
        scope,
        `Failed to update ${this.displayName}`,
        ErrorCode.Generic,
      );
    }

    return R.Void;
  }
}
