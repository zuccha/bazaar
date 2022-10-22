import { CliUx } from "@oclif/core";
import { R } from "../../api/utils/result";
import BaseCommand from "../../utils/base-command";

export default class ToolUninstallAllCommand extends BaseCommand<
  typeof ToolUninstallAllCommand
> {
  static summary = "Uninstall all tool.";
  static description =
    "Once uninstalled, you will have to re-install tools to use related features.";

  static examples = [];

  async run(): Promise<void> {
    CliUx.ux.action.start("Uninstalling tools");
    const response = await this.api.tool.uninstallAll();
    if (R.isOk(response)) {
      CliUx.ux.action.stop();
      return;
    }

    const messages = R.messages(response, { verbose: true });
    this.Error(`Failed to uninstall tools\n${messages}`, 1);
  }
}
