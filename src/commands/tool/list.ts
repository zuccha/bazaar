// import ToolApi from "../../api/managers/tool-manager";
import { CliUx } from "@oclif/core";
import ToolManager from "../../api/managers/tool-manager";
import { SupportedToolName } from "../../api/managers/tool-manager/supported-tool";
import { Tool } from "../../api/managers/tool-manager/tool";
import { R } from "../../api/utils/result";
import BaseCommand from "../../utils/base-command";
import TE from "../../utils/text-effect";

export default class ToolListCommand extends BaseCommand<
  typeof ToolListCommand
> {
  static summary = "List tools and their installation status";
  static description = `\
List tools and their installation status. Tools are programs required by Bazar\
 to perform specific tasks, and need to be of a precise version to ensure\
 everything works correctly. For this reason, the user cannot choose to use a\
 custom version.

The installation of tools is completely handled by Bazar. Installing and\
 uninstalling a tool with Bazar will not impact any other installation of the\
 same tool done by the user on the same machine. This means that the user can\
 still use their preferred tools for hacking SMW without Bazar.

A tool can be either not installed, installed, or deprecated:
- ${TE.b("not-installed")}: The tool is not installed in Bazar, tasks that\
 require the tool cannot be performed.
- ${TE.b("installed")}: The correct version of the tool has been installed in\
 Bazar. If the version appears to be broken (doesn't work correctly), you can\
 uninstall it and install it again (or force install it). For more, check\
 \`bazar tool install --help\` and \`bazar tool uninstall --help\`.
- ${TE.b("deprecated")}: The wrong version of the tool has been installed in\
 Bazar. This can happen if the user upgraded Bazar, and the new version\
 requires a different version of a tool previously installed. To upgrade a\
 tool, check \`bazar tool update --help\`.

Tools used by Bazar:
- ${TE.b("AddmusicK")}: Used to insert music.
- ${TE.b("Asar")}: Used to apply patches.
- ${TE.b("Flips")}: Used to produce releases (BPS files).
- ${TE.b("GPS")}: Used to insert blocks.
- ${TE.b("Lunar")} Magic: Used to open the ROM hack, and extract graphics and\
 levels.
- ${TE.b("PIXI")}: Used to insert sprites.
- ${TE.b("UberASM")}: Used to apply UberASM code.

The difference between tools and editors: tools need to be of specific versions\
 to ensure that they work correctly, while editors are user-chosen programs.\
 If you want to install tools instead, check out \`bazar editor --help\`.`;

  static examples = ["bazar tool list", "bazar tool list uber-asm"];

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
      const toolResult = await this.api.tool.list(toolName);
      if (R.isError(toolResult)) {
        const messages = R.messages(toolResult, { verbose: true });
        this.Error(`Failed to list ${toolName}\n${messages}`, 1);
        return;
      }

      this.logTools([toolResult.data]);
    } else {
      const toolsResult = await this.api.tool.listAll();
      if (R.isError(toolsResult)) {
        const messages = R.messages(toolsResult, { verbose: true });
        this.Error(`Failed to list tools\n${messages}`, 1);
        return;
      }

      this.logTools(toolsResult.data);
    }
  }

  async logTools(tools: Tool[]): Promise<void> {
    const { flags } = await this.parse(ToolListCommand);

    CliUx.ux.table(
      tools,
      {
        name: {
          get: (tool) => tool.displayName,
        },
        status: {
          get: (tool) =>
            ({
              "not-installed": TE.failure("Not installed"),
              installed: TE.success("Installed"),
              deprecated: TE.warning("Deprecated"),
            }[tool.installationStatus]),
        },
        supportedVersion: {
          get: (tool) => tool.supportedVersion,
          header: "Version (supported)",
        },
        installedVersion: {
          get: (tool) => tool.installedVersion || TE.i("<none>"),
          header: "Version (installed)",
        },
      },
      flags,
    );
  }
}
