import { Flags } from "@oclif/core";
import { ToolErrorCode } from "../../api/managers/tool-collection/tool";
import { R } from "../../api/utils/result";
import { getTool, ToolName } from "../../commands-utils/tool";
import BaseCommand from "../../utils/base-command";
import ToolListCommand from "./list";

export default class ToolInstallCommand extends BaseCommand<
  typeof ToolListCommand
> {
  static summary = "Install a given tool";
  static description = `\
The tool will be downloaded by SMWCentral.

By default, only a tool that is not installed can be installed. If the\
 \`--force\` flag is given, the newest supported version of the tool will be\
 installed regardless of its current installation status.

The command will fail if trying to install an already installed tool without\
 the \`--force\` flag.

Installing a tool will not interfere with any other manual installation of the\
 tool made by the user on the same machine.`;

  static examples = [
    "bazaar tool install asar",
    "bazaar tool install lunar-magic --force",
  ];

  static args = [
    {
      name: "tool-name",
      required: true,
      description: "Name of the tool",
      options: Object.values(ToolName),
    },
  ];

  static flags = {
    force: Flags.boolean({
      char: "f",
      summary: "Install the tool even if another version is already installed",
      description:
        "Force-installing a tool will remove other versions of the tool previously installed.",
      default: false,
    }),
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(ToolInstallCommand);

    const toolName = args["tool-name"];

    this.Info.start(`Installing ${toolName}`);
    const response = await getTool(this.api.tools, toolName).install({
      force: flags.force,
    });
    if (R.isOk(response)) {
      this.Info.success();
      return;
    }

    if (response.code === ToolErrorCode.ToolAlreadyInstalled) {
      this.Info.failure();
      this.Warning.log(`${toolName} is already installed!
Run with \`--force\` if you want to force the installation:
$ bazaar tool install ${toolName} --force`);
      return;
    }

    this.Info.failure();
    const messages = R.messages(response, { verbose: true });
    this.Error(`Failed to install ${toolName}\n${messages}`, 1);
  }
}
