// import ToolApi from "../../api/managers/tool-manager";
import { CliUx } from "@oclif/core";
import ToolManager from "../../api/managers/tool-manager";
import { SupportedToolName } from "../../api/managers/tool-manager/supported-tool";
import { ToolInfo } from "../../api/managers/tool-manager/types";
import { R } from "../../api/utils/result";
import BaseCommand from "../../utils/base-command";
import TextEffect from "../../utils/text-effect";

export default class ToolListCommand extends BaseCommand<
  typeof ToolListCommand
> {
  static summary = "List tools and their installation status.";
  static description = `\
List tools and their installation status. A tool can be either not installed,\
 installed, or deprecated.
Deprecated tools might not work with the current version of Bazar and need to\
 be updated.`;

  static args = [
    {
      name: "tool-name",
      required: false,
      description: "Name of the tool",
      options: ToolManager.ToolNames,
    },
  ];

  static flags = {
    ...CliUx.ux.table.flags(),
  };

  async run(): Promise<void> {
    const { args } = await this.parse(ToolListCommand);
    const toolName: SupportedToolName | undefined = args["tool-name"];

    if (toolName) {
      const toolInfoResult = await this.api.tool.list(toolName);
      if (R.isError(toolInfoResult)) {
        const messages = R.messages(toolInfoResult, { verbose: true });
        this.Error(`Failed to list ${toolName}\n${messages}`, 1);
        return;
      }

      this.logToolInfos([toolInfoResult.data]);
    } else {
      const toolInfosResult = await this.api.tool.listAll();
      if (R.isError(toolInfosResult)) {
        const messages = R.messages(toolInfosResult, { verbose: true });
        this.Error(`Failed to list tools\n${messages}`, 1);
        return;
      }

      this.logToolInfos(toolInfosResult.data);
    }
  }

  async logToolInfos(toolInfos: ToolInfo[]): Promise<void> {
    const { flags } = await this.parse(ToolListCommand);

    CliUx.ux.table(
      toolInfos,
      {
        name: {
          get: (toolInfo) => toolInfo.tool.displayName,
        },
        status: {
          get: (toolInfo) =>
            ({
              "not-installed": TextEffect.failure("Not installed"),
              installed: TextEffect.success("Installed"),
              deprecated: TextEffect.warning("Deprecated"),
            }[toolInfo.status]),
        },
        supportedVersion: {
          get: (toolInfo) => toolInfo.tool.supportedVersion,
          header: "Version (supported)",
        },
        installedVersion: {
          get: (toolInfo) =>
            toolInfo.installedVersion || TextEffect.i("<none>"),
          header: "Version (installed)",
        },
      },
      flags,
    );
  }
}
