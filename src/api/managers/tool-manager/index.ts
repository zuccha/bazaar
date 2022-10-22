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
  Generic,
}

export default class ToolManager extends Manager {
  protected directoryName = "Tools";

  static ToolNames: SupportedToolName[] = Object.keys(
    SupportedTool,
  ) as SupportedToolName[];

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
      return R.Ok({ tool, status: "not-installed" });
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
      return R.Ok({ tool, status: "not-installed" });
    }

    if (directoryNames.includes(tool.supportedVersion)) {
      return R.Ok({ tool, status: "installed" });
    }

    return R.Ok({ tool, status: "deprecated" });
  }

  async install(
    toolName: SupportedToolName,
    partialOptions?: Partial<{ force: boolean }>,
  ): Promise<ResultVoid> {
    const scope = "tool.list.install";
    let result: ResultVoid;

    const options = { force: false, ...partialOptions };

    const tool = SupportedTool[toolName];
    const toolDirectoryPath = this.fs.join(this.path, tool.name);

    this.log(`Checking if ${tool.displayName} is already installed...`);
    const toolDirectoryPathExists = await this.fs.exists(toolDirectoryPath);
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
}
