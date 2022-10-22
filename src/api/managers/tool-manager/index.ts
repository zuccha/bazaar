import Manager from "../../utils/manager";
import { R, Result, ResultOk, ResultVoid } from "../../utils/result";
import SupportedTool, { SupportedToolName } from "./supported-tool";
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
  ToolNotInstalled,
  Generic,
}

export default class ToolManager extends Manager {
  protected directoryName = "Tools";

  static ToolNames: SupportedToolName[] = Object.keys(
    SupportedTool,
  ) as SupportedToolName[];

  async installAll(
    partialOptions?: Partial<{ force: boolean }>,
  ): Promise<ResultVoid> {
    const scope = "tool.installAll";

    const options = { force: false, ...partialOptions };

    const results = await Promise.all(
      Object.values(SupportedTool).map((tool) =>
        this.install(tool.name, {
          force: options.force,
          ignoreIfAlreadyInstalled: true,
        }),
      ),
    );

    for (const result of results) {
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
    const scope = "tool.list.install";
    let result: ResultVoid;

    const options = {
      force: false,
      ignoreIfAlreadyInstalled: false,
      ...partialOptions,
    };

    const tool = SupportedTool[toolName];
    const toolDirectoryPath = this.fs.join(this.path, tool.name);

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
    const scope = "tool.listAll";

    const tools = Object.values(SupportedTool);
    const toolInfoResults = await Promise.all(
      tools.map((tool) => this.list(tool.name)),
    );

    for (const toolInfoResult of toolInfoResults) {
      if (R.isError(toolInfoResult)) {
        const message = "Failed to gather data for tool";
        return R.Stack(
          toolInfoResult,
          scope,
          message,
          ToolManagerError.Generic,
        );
      }
    }

    return R.Ok(
      toolInfoResults.map(
        (toolInfoResult) => (toolInfoResult as ResultOk<ToolInfo>).data,
      ),
    );
  }

  async list(toolName: SupportedToolName): Promise<Result<ToolInfo>> {
    const scope = "tool.list";

    const tool = SupportedTool[toolName];
    const toolDirectoryPath = this.fs.join(this.path, tool.name);

    const toolDirectoryPathExists = await this.fs.exists(toolDirectoryPath);
    if (!toolDirectoryPathExists) {
      return R.Ok({
        tool,
        status: "not-installed",
        installedVersion: undefined,
      });
    }

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
    const scope = "tool.uninstallAll";

    const results = await Promise.all(
      Object.values(SupportedTool).map((tool) =>
        this.uninstall(tool.name, {
          ignoreIfNotInstalled: true,
        }),
      ),
    );

    for (const result of results) {
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
    const scope = "tool.uninstall";

    const options = { ignoreIfNotInstalled: false, ...partialOptions };

    const tool = SupportedTool[toolName];
    const toolDirectoryPath = this.fs.join(this.path, tool.name);

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
}
