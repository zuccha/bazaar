import Manager from "../../utils/manager";
import { R, ResultVoid } from "../../utils/result";
import SupportedTool, { SupportedToolName } from "./supported-tool";
import { ToolInfo } from "./types";

export enum ToolManagerError {
  FailedToCreateMainDirectory,
  FailedToCreateVersionDirectory,
  FailedToRemoveMainDirectory,
  FailedToRemoveVersionDirectory,
  ToolAlreadyInstalled,
}

export default class ToolManager extends Manager {
  protected directoryName = "Tools";

  static ToolNames: SupportedToolName[] = Object.keys(
    SupportedTool,
  ) as SupportedToolName[];

  list(): ToolInfo[] {
    return Object.values(SupportedTool).map((tool) => ({
      tool,
      status: "not-installed",
    }));
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

    // TODO: Unzip supported tool.
    // TODO: Move supported tool in correct directory.
    // TODO: Delete zip file.

    return R.Void;
  }
}
