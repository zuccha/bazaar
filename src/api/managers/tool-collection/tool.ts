import { ShellOutput } from "../../utils/fs";
import { R, Result, ResultVoid } from "../../utils/result";
import Directory from "../directory";

export type ToolInfo = {
  name: string;
  supportedVersion: string;
  installedVersion: string | undefined;
  installationStatus: "not-installed" | "installed" | "deprecated";
};

export enum ToolErrorCode {
  Internal,
  ToolAlreadyInstalled,
  ToolNotInstalled,
  ToolNotUpToDate,
  ToolUpToDate,
}

export type ToolErrorCodes = {
  Exec: ToolErrorCodes["List"] | ToolErrorCode.ToolNotUpToDate;
  List: ToolErrorCode.Internal;
  Install: ToolErrorCode.Internal | ToolErrorCode.ToolAlreadyInstalled;
  Uninstall: ToolErrorCode.Internal | ToolErrorCode.ToolNotInstalled;
  Update:
    | ToolErrorCode.Internal
    | ToolErrorCode.ToolNotInstalled
    | ToolErrorCode.ToolUpToDate;
};

export default abstract class Tool extends Directory {
  abstract readonly displayName: string;
  protected abstract readonly exeName: string;
  protected abstract readonly downloadUrl: string;
  protected abstract readonly supportedVersion: string;

  protected async exec(
    ...args: string[]
  ): Promise<Result<ShellOutput, ToolErrorCodes["Exec"]>> {
    const scope = this.scope("exec");

    this.logger.start("Gathering information about tool");
    const infoResult = await this.list();
    if (R.isError(infoResult)) {
      this.logger.failure();
      return infoResult;
    }
    this.logger.success();

    const info = infoResult.data;
    if (info.installationStatus !== "installed" || !info.installedVersion) {
      const message = `${info.name} is not up to date`;
      return R.Error(scope, message, ToolErrorCode.ToolNotUpToDate);
    }

    const exePath = this.path(info.installedVersion, this.exeName);
    const command = `"${exePath}" ${args.map((arg) => `"${arg}"`).join(" ")}`;

    this.logger.start(`Executing tool command`);
    this.logger.log(`$ ${command}`);
    const execResult = await this.fs.exec(command);
    if (R.isError(execResult)) {
      this.logger.failure();
      const message = `Failed to execute command \`${command}\``;
      return R.Stack(execResult, scope, message, ToolErrorCode.Internal);
    }
    this.logger.success();

    return R.Ok(execResult.data);
  }

  async list(): Promise<Result<ToolInfo, ToolErrorCodes["List"]>> {
    const scope = this.scope("list");

    const baseInfo = {
      name: this.displayName,
      supportedVersion: this.supportedVersion,
    };

    this.logger.start(`Checking if tool directory exists`);
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

    this.logger.start(`Gathering directory information`);
    const toolDirectoryInfoResult = await this.getDirectoryInfo();
    if (R.isError(toolDirectoryInfoResult)) {
      this.logger.failure();
      const message = `Failed to gather directory "${this.path()}" information`;
      return R.Stack(
        toolDirectoryInfoResult,
        scope,
        message,
        ToolErrorCode.Internal,
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
  ): Promise<ResultVoid<ToolErrorCodes["Install"]>> {
    const scope = this.scope("install");

    const options = {
      force: false,
      ignoreIfAlreadyInstalled: false,
      ...partialOptions,
    };

    this.logger.start(`Checking if tool is already installed`);
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
          ToolErrorCode.ToolAlreadyInstalled,
        );
      }

      this.logger.success();

      this.logger.start("Removing old versions");
      const removeDirectoryResult = await this.removeDirectory();
      if (R.isError(removeDirectoryResult)) {
        this.logger.failure();
        return R.Stack(
          removeDirectoryResult,
          scope,
          `Failed to remove "${this.displayName}" directory`,
          ToolErrorCode.Internal,
        );
      }
      this.logger.success();
    }

    this.logger.start(`Creating tool directory`);
    const createDirectoryResult = await this.createDirectory();
    if (R.isError(createDirectoryResult)) {
      this.logger.failure();
      return R.Stack(
        createDirectoryResult,
        scope,
        `Failed to create "${this.displayName}" directory`,
        ToolErrorCode.Internal,
      );
    }
    this.logger.success();

    this.logger.start(`Downloading tool`);
    const toolZipFilePath = this.path(`${this.supportedVersion}.zip`);
    const downloadResult = await this.fs.downloadFile(
      toolZipFilePath,
      this.downloadUrl,
    );
    if (R.isError(downloadResult)) {
      this.logger.failure();
      return R.Stack(
        downloadResult,
        scope,
        `Failed to download ${this.displayName} from SMWCentral`,
        ToolErrorCode.Internal,
      );
    }
    this.logger.success();

    this.logger.start(`Extracting tool archive`);
    const toolVersionDirectoryPath = this.path(this.supportedVersion);
    const unzipResult = await this.fs.unzipFile(
      toolZipFilePath,
      toolVersionDirectoryPath,
      { collapseSingleDirectoryArchive: true },
    );
    if (R.isError(unzipResult)) {
      this.logger.failure();
      return R.Stack(
        unzipResult,
        scope,
        `Failed to extract ${this.displayName} archive`,
        ToolErrorCode.Internal,
      );
    }
    this.logger.success();

    this.logger.start(`Removing tool archive`);
    const removeArchiveResult = await this.fs.removeFile(toolZipFilePath);
    if (R.isError(removeArchiveResult)) {
      this.logger.failure();
      return R.Stack(
        removeArchiveResult,
        scope,
        `Failed to remove "${this.displayName}" archive`,
        ToolErrorCode.Internal,
      );
    }
    this.logger.success();

    return R.Void;
  }

  async uninstall(
    partialOptions?: Partial<{
      ignoreIfNotInstalled: boolean;
    }>,
  ): Promise<ResultVoid<ToolErrorCodes["Uninstall"]>> {
    const scope = this.scope("uninstall");

    const options = { ignoreIfNotInstalled: false, ...partialOptions };

    this.logger.start(`Checking if tool is installed`);
    const toolDirectoryPathExists = await this.exists();
    if (options.ignoreIfNotInstalled && !toolDirectoryPathExists) {
      this.logger.done("not installed, ignoring");
      return R.Void;
    }

    if (!toolDirectoryPathExists) {
      this.logger.failure();
      return R.Error(
        scope,
        `${this.displayName} is not installed`,
        ToolErrorCode.ToolNotInstalled,
      );
    }
    this.logger.success();

    this.logger.start(`Removing tool directory`);
    const result = await this.removeDirectory();
    if (R.isError(result)) {
      return R.Error(
        scope,
        `Failed to remove ${this.displayName} directory`,
        ToolErrorCode.Internal,
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
  ): Promise<ResultVoid<ToolErrorCodes["Update"]>> {
    const scope = this.scope("update");

    const options = {
      ignoreIfNotInstalled: false,
      ignoreIfUpToDate: false,
      ...partialOptions,
    };

    const toolVersionDirectoryPath = this.path(this.supportedVersion);

    this.logger.start(`Checking if tool is up to date`);
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
        `${this.displayName} is already up to date`,
        ToolErrorCode.ToolUpToDate,
      );
    }
    this.logger.failure();

    this.logger.start(`Checking if another tool version is installed`);
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
        ToolErrorCode.ToolNotInstalled,
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
        ToolErrorCode.Internal,
      );
    }

    return R.Void;
  }
}
