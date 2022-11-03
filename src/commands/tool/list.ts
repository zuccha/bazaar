import { CliUx } from "@oclif/core";
import { ToolInfo } from "../../api/managers/tool-collection/tool";
import { R } from "../../api/utils/result";
import { getTool, ToolName } from "../../commands-utils/tool";
import BaseCommand from "../../utils/base-command";
import TE from "../../utils/text-effect";

export default class ToolListCommand extends BaseCommand<
  typeof ToolListCommand
> {
  static summary = "List tools and their installation status";
  static description = `\
List tools and their installation status. Tools are programs required by Bazaar\
 to perform specific tasks, and need to be of a precise version to ensure\
 everything works correctly. For this reason, the user cannot choose to use a\
 custom version.

The installation of tools is completely handled by Bazaar. Installing and\
 uninstalling a tool with Bazaar will not impact any other installation of the\
 same tool done by the user on the same machine. This means that the user can\
 still use their preferred tools for hacking SMW without Bazaar.

A tool can be either not installed, installed, or deprecated:
- ${TE.b("not-installed")}: The tool is not installed in Bazaar, tasks that\
 require the tool cannot be performed.
- ${TE.b("installed")}: The correct version of the tool has been installed in\
 Bazaar. If the version appears to be broken (doesn't work correctly), you can\
 uninstall it and install it again (or force install it). For more, check\
 \`bazaar tool install --help\` and \`bazaar tool uninstall --help\`.
- ${TE.b("deprecated")}: The wrong version of the tool has been installed in\
 Bazaar. This can happen if the user upgraded Bazaar, and the new version\
 requires a different version of a tool previously installed. To upgrade a\
 tool, check \`bazaar tool update --help\`.

Tools used by Bazaar:
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
 If you want to install tools instead, check out \`bazaar editor --help\`.`;

  static examples = ["bazaar tool list", "bazaar tool list uber-asm"];

  static args = [
    {
      name: "tool-name",
      required: false,
      description: "Name of the tool",
      options: Object.values(ToolName),
    },
  ];

  static flags = {
    ...CliUx.ux.table.flags(),
  };

  async run(): Promise<void> {
    const { args } = await this.parse(ToolListCommand);
    const toolName: ToolName | undefined = args["tool-name"];

    if (toolName) {
      const toolInfoResult = await getTool(this.api.tools, toolName).list();
      if (R.isError(toolInfoResult)) {
        const messages = R.messages(toolInfoResult, { verbose: true });
        this.Error(`Failed to list ${toolName}\n${messages}`, 1);
        return;
      }

      this.logToolInfos([toolInfoResult.data]);
    } else {
      const toolInfosResult = await this.api.tools.listAll();
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
          get: (toolInfo) => toolInfo.name,
        },
        status: {
          get: (toolInfo) =>
            ({
              "not-installed": TE.failure("Not installed"),
              installed: TE.success("Installed"),
              deprecated: TE.warning("Deprecated"),
            }[toolInfo.installationStatus]),
        },
        supportedVersion: {
          get: (toolInfo) => toolInfo.supportedVersion,
          header: "Version (supported)",
        },
        installedVersion: {
          get: (toolInfo) => toolInfo.installedVersion || TE.i("<none>"),
          header: "Version (installed)",
        },
      },
      // `flags` can contain `undefined` values, TS complains because of the
      // `exactOptionalPropertyTypes` rule. Removing `undefined` props is a pain
      // and `CliUx.ux.table` allows `undefined` values, so we ignore the error.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      flags,
    );
  }
}
