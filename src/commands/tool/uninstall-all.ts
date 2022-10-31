import { CliUx } from "@oclif/core";
import { R } from "../../api/utils/result";
import BaseCommand from "../../utils/base-command";

export default class ToolUninstallAllCommand extends BaseCommand<
  typeof ToolUninstallAllCommand
> {
  static summary = "Uninstall all tools";
  static description = `\
Only tools that are already installed can be uninstalled. Tools that are not\
 installed will be ignored.

Uninstalling tools with Bazar will not cause any other installation made by the\
 user on the machine to be uninstalled.`;

  static examples = ["bazaar tool uninstall-all"];

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
