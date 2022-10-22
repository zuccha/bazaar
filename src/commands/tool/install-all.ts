import { CliUx, Flags } from "@oclif/core";
import { R } from "../../api/utils/result";
import BaseCommand from "../../utils/base-command";

export default class ToolInstallAllCommand extends BaseCommand<
  typeof ToolInstallAllCommand
> {
  static summary = "Install all tools required by Bazar.";
  static description = `\
The tools will be downloaded by SMWCentral.
If a tool is already installed, it will be skipped.`;

  static examples = [];

  static flags = {
    force: Flags.boolean({
      char: "f",
      summary:
        "Install all tools even if other versions are already installed.",
      description:
        "Force-installing a tool will remove other versions of the tool previously installed.",
      default: false,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(ToolInstallAllCommand);

    CliUx.ux.action.start("Installing tools");
    const response = await this.api.tool.installAll({
      force: flags.force,
    });
    if (R.isOk(response)) {
      CliUx.ux.action.stop();
      return;
    }

    const messages = R.messages(response, { verbose: true });
    this.Error(`Failed to install tools\n${messages}`, 1);
  }
}
