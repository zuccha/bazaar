// import ToolApi from "../../api/managers/tool-manager";
import { CliUx } from "@oclif/core";
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

  static flags = {
    ...CliUx.ux.table.flags(),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(ToolListCommand);

    const toolInfos = this.api.tool.list();

    CliUx.ux.table(
      toolInfos,
      {
        name: {
          get: (toolInfo) => toolInfo.tool.displayName,
        },
        supportedVersion: {
          get: (toolInfo) => toolInfo.tool.version,
          header: "Supported version",
        },
        status: {
          get: (toolInfo) =>
            ({
              "not-installed": TextEffect.failure("Not installed"),
              installed: TextEffect.success("Installed"),
              deprecated: TextEffect.warning("Deprecated"),
            }[toolInfo.status]),
        },
      },
      {
        ...flags,
      },
    );
  }
}
