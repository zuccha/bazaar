import { R } from "../../api/utils/result";
import BaseCommand from "../../utils/base-command";

export default class ToolUninstallAllCommand extends BaseCommand<
  typeof ToolUninstallAllCommand
> {
  static summary = "Uninstall all tools";
  static description = `\
Only tools that are already installed can be uninstalled. Tools that are not\
 installed will be ignored.

Uninstalling tools with Bazaar will not cause any other installation made by the\
 user on the machine to be uninstalled.`;

  static examples = ["bazaar tool uninstall-all"];

  async run(): Promise<void> {
    this.Info.start("Uninstalling tools");
    const response = await this.api.tools.uninstallAll();
    if (R.isOk(response)) {
      this.Info.success();
      return;
    }

    this.Info.failure();
    const messages = R.messages(response, { verbose: true });
    this.Error(`Failed to uninstall tools\n${messages}`, 1);
  }
}
