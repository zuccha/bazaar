import Manager from "../../utils/manager";
import { R, Result, ResultVoid } from "../../utils/result";
import SupportedTool, {
  SupportedToolName,
  SupportedTools,
} from "./supported-tool";
import { ToolInfo } from "./types";

export enum ToolManagerError {
  FailedToCreateMainDirectory,
  FailedToCreateVersionDirectory,
  FailedToExtractArchive,
  FailedToReadToolDirectoryContent,
  FailedToRemoveArchive,
  FailedToRemoveMainDirectory,
  FailedToRemoveVersionDirectory,
  ToolAlreadyInstalled,
  ToolIsUpToDate,
  ToolNotInstalled,
  Generic,
}

export default class ToolManager extends Manager {
  protected id = "tool";
  protected directoryName = "Tools";

  static ToolNames: SupportedToolName[] = Object.keys(
    SupportedTool,
  ) as SupportedToolName[];

  async installAll(
    partialOptions?: Partial<{ force: boolean }>,
  ): Promise<ResultVoid> {
    const scope = this.scope("installAll");

    const options = { force: false, ...partialOptions };

    for (const tool of SupportedTools) {
      const result = await this.install(tool.name, {
        force: options.force,
        ignoreIfAlreadyInstalled: true,
      });

      if (R.isError(result)) {
        const message = "Failed to install all tools";
        return R.Stack(result, scope, message, ToolManagerError.Generic);
      }
    }

    return R.Void;
  }

  async install(
    toolName: SupportedToolName,
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

    const tool = SupportedTool[toolName];
    const toolDirectoryPath = this.path(tool.name);

    this.log(`Checking if ${tool.displayName} is already installed...`);
    const toolDirectoryPathExists = await this.fs.exists(toolDirectoryPath);
    if (options.ignoreIfAlreadyInstalled && toolDirectoryPathExists) {
      this.log(`${tool.displayName} is already installed`);
      return R.Void;
    }

    if (!options.force && toolDirectoryPathExists) {
      return R.Error(
        scope,
        `${tool.displayName} is already installed`,
        ToolManagerError.ToolAlreadyInstalled,
      );
    }

    if (toolDirectoryPathExists) {
      this.log(
        `${tool.displayName} already installed, removing other versions`,
      );
      result = await this.fs.removeDirectory(toolDirectoryPath);
      if (R.isError(result)) {
        return R.Stack(
          result,
          scope,
          `Failed to remove "${tool.displayName}" directory`,
          ToolManagerError.FailedToRemoveMainDirectory,
        );
      }
    } else {
      this.log(`${tool.displayName} is not installed`);
    }

    this.log(`Creating "${tool.name}" directory...`);
    result = await this.fs.createDirectory(toolDirectoryPath);
    if (R.isError(result)) {
      return R.Stack(
        result,
        scope,
        `Failed to create "${tool.displayName}" directory`,
        ToolManagerError.FailedToCreateMainDirectory,
      );
    }
    this.log(`"${tool.name}" directory created`);

    this.log(`Downloading ${tool.displayName}...`);
    const toolZipFilePath = this.fs.join(
      toolDirectoryPath,
      `${tool.supportedVersion}.zip`,
    );
    result = await this.fs.downloadFile(toolZipFilePath, tool.downloadUrl);
    if (R.isError(result)) {
      return R.Stack(
        result,
        scope,
        `Failed to download ${tool.displayName} from SMWCentral`,
        ToolManagerError.FailedToRemoveMainDirectory,
      );
    }
    this.log(`${tool.displayName} downloaded`);

    this.log(`Extracting ${tool.displayName} archive...`);
    const toolVersionDirectoryPath = this.fs.join(
      toolDirectoryPath,
      tool.supportedVersion,
    );
    result = await this.fs.unzipFile(
      toolZipFilePath,
      toolVersionDirectoryPath,
      { collapseSingleDirectoryArchive: true },
    );
    if (R.isError(result)) {
      return R.Stack(
        result,
        scope,
        `Failed to extract ${tool.displayName} archive`,
        ToolManagerError.FailedToRemoveMainDirectory,
      );
    }
    this.log(`${tool.displayName} archive extracted`);

    this.log(`Removing ${tool.displayName} archive...`);
    result = await this.fs.removeFile(toolZipFilePath);
    if (R.isError(result)) {
      return R.Stack(
        result,
        scope,
        `Failed to remove "${tool.displayName}" archive`,
        ToolManagerError.FailedToRemoveArchive,
      );
    }
    this.log(`${tool.displayName} archive removed`);

    return R.Void;
  }

  async listAll(): Promise<Result<ToolInfo[]>> {
    const scope = this.scope("listAll");

    const toolInfos: ToolInfo[] = [];

    for (const tool of SupportedTools) {
      const toolInfoResult = await this.list(tool.name);

      if (R.isError(toolInfoResult)) {
        const message = "Failed to gather data for tool";
        return R.Stack(
          toolInfoResult,
          scope,
          message,
          ToolManagerError.Generic,
        );
      }

      toolInfos.push(toolInfoResult.data);
    }

    return R.Ok(toolInfos);
  }

  async list(toolName: SupportedToolName): Promise<Result<ToolInfo>> {
    const scope = this.scope("list");

    const tool = SupportedTool[toolName];
    const toolDirectoryPath = this.path(tool.name);

    this.log(`Checking if ${tool.displayName} directory exists...`);
    const toolDirectoryPathExists = await this.fs.exists(toolDirectoryPath);
    if (!toolDirectoryPathExists) {
      this.log(`${tool.displayName} directory does not exist`);
      return R.Ok({
        tool,
        status: "not-installed",
        installedVersion: undefined,
      });
    }
    this.log(`${tool.displayName} directory exists`);

    this.log(`Collecting ${tool.displayName} directory information...`);
    const toolDirectoryInfoResult = await this.fs.getDirectoryInfo(
      toolDirectoryPath,
    );
    if (R.isError(toolDirectoryInfoResult)) {
      const message = "Failed to read directory content";
      return R.Stack(
        toolDirectoryInfoResult,
        scope,
        message,
        ToolManagerError.FailedToReadToolDirectoryContent,
      );
    }
    this.log(`${tool.displayName} directory information collected`);

    const { directoryNames } = toolDirectoryInfoResult.data;
    if (directoryNames.length === 0) {
      return R.Ok({
        tool,
        status: "not-installed",
        installedVersion: undefined,
      });
    }

    if (directoryNames.includes(tool.supportedVersion)) {
      return R.Ok({
        tool,
        status: "installed",
        installedVersion: tool.supportedVersion,
      });
    }

    return R.Ok({
      tool,
      status: "deprecated",
      installedVersion: directoryNames[0],
    });
  }

  async uninstallAll(): Promise<ResultVoid> {
    const scope = this.scope("uninstallAll");

    for (const tool of SupportedTools) {
      const result = await this.uninstall(tool.name, {
        ignoreIfNotInstalled: true,
      });

      if (R.isError(result)) {
        const message = "Failed to uninstall all tools";
        return R.Stack(result, scope, message, ToolManagerError.Generic);
      }
    }

    return R.Void;
  }

  async uninstall(
    toolName: SupportedToolName,
    partialOptions?: Partial<{
      ignoreIfNotInstalled: boolean;
    }>,
  ): Promise<ResultVoid> {
    const scope = this.scope("uninstall");

    const options = { ignoreIfNotInstalled: false, ...partialOptions };

    const tool = SupportedTool[toolName];
    const toolDirectoryPath = this.path(tool.name);

    this.log(`Checking if ${tool.displayName} is installed...`);
    const toolDirectoryPathExists = await this.fs.exists(toolDirectoryPath);
    if (options.ignoreIfNotInstalled && !toolDirectoryPathExists) {
      this.log(`${tool.displayName} not installed`);
      return R.Void;
    }

    if (!toolDirectoryPathExists) {
      return R.Error(
        scope,
        `${tool.displayName} is not installed`,
        ToolManagerError.ToolNotInstalled,
      );
    }
    this.log(`${tool.displayName} is installed`);

    this.log(`Removing "${tool.name}" directory...`);
    const result = await this.fs.removeDirectory(toolDirectoryPath);
    if (R.isError(result)) {
      return R.Error(
        scope,
        `Failed to remove "${tool.name}" directory`,
        ToolManagerError.Generic,
      );
    }
    this.log(`"${tool.name}" directory removed`);

    return R.Void;
  }

  async updateAll(): Promise<ResultVoid> {
    const scope = this.scope("updateAll");

    for (const tool of SupportedTools) {
      const result = await this.update(tool.name, {
        ignoreIfNotInstalled: true,
        ignoreIfUpToDate: true,
      });

      if (R.isError(result)) {
        const message = "Failed to update all tools";
        return R.Stack(result, scope, message, ToolManagerError.Generic);
      }
    }

    return R.Void;
  }

  async update(
    toolName: SupportedToolName,
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

    const tool = SupportedTool[toolName];
    const toolVersionDirectoryPath = this.path(
      tool.name,
      tool.supportedVersion,
    );

    this.log(`Checking if ${tool.displayName} is up to date...`);
    const toolVersionDirectoryPathExists = await this.fs.exists(
      toolVersionDirectoryPath,
    );
    if (toolVersionDirectoryPathExists && options.ignoreIfUpToDate) {
      this.log(`${tool.displayName} is up to date`);
      return R.Void;
    }

    if (toolVersionDirectoryPathExists) {
      return R.Error(
        scope,
        `${tool.displayName} is up to date`,
        ToolManagerError.ToolIsUpToDate,
      );
    }
    this.log(`${tool.displayName} is not up to date`);

    this.log(`Checking if another ${tool.displayName} version is installed...`);
    const toolDirectoryPath = this.path(tool.name);
    const toolDirectoryPathExists = await this.fs.exists(toolDirectoryPath);
    if (!toolDirectoryPathExists && options.ignoreIfNotInstalled) {
      this.log(`Another ${tool.displayName} version is not installed`);
      return R.Void;
    }

    if (!toolDirectoryPathExists) {
      return R.Error(
        scope,
        `${tool.displayName} is not installed`,
        ToolManagerError.ToolNotInstalled,
      );
    }
    this.log(`Another ${tool.displayName} version is installed`);

    const result = await this.install(toolName, { force: true });
    if (R.isError(result)) {
      return R.Stack(
        result,
        scope,
        `Failed to update ${tool.displayName}`,
        ToolManagerError.Generic,
      );
    }

    return R.Void;
  }
}
