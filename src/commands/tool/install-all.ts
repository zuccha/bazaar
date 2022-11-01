import { Flags } from "@oclif/core";
import { R } from "../../api/utils/result";
import BaseCommand from "../../utils/base-command";

export default class ToolInstallAllCommand extends BaseCommand<
  typeof ToolInstallAllCommand
> {
  static summary = "Install all tools required by Bazaar";
  static description = `\
The tools will be downloaded by SMWCentral.

By default, only a tool that is not installed can be installed. If the\
 \`--force\` flag is given, the newest supported version of the tool will be\
 installed regardless of its current installation status.

The command will ignore already installed tools without if executed without the\
 \`--force\` flag.

Installing a tool will not interfere with any other manual installation of the\
 tool made by the user on the same machine.`;

  static examples = [
    "bazaar tool install-all",
    "bazaar tool install-all --force",
  ];

  static flags = {
    force: Flags.boolean({
      char: "f",
      summary: "Install all tools even if other versions are already installed",
      description:
        "Force-installing a tool will remove other versions of the tool previously installed.",
      default: false,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(ToolInstallAllCommand);

    this.Info.start("Installing tools");
    const response = await this.api.tools.installAll({
      force: flags.force,
    });
    if (R.isOk(response)) {
      this.Info.success();
      return;
    }

    this.Info.failure();
    const messages = R.messages(response, { verbose: true });
    this.Error(`Failed to install tools\n${messages}`, 1);
  }
}
