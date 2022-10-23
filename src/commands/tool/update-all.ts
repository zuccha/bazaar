import { CliUx } from "@oclif/core";
import { R } from "../../api/utils/result";
import BaseCommand from "../../utils/base-command";

export default class ToolUpdateAllCommand extends BaseCommand<
  typeof ToolUpdateAllCommand
> {
  static summary = "Update all tools to their last version supported by Bazar.";
  static description =
    "The new versions of the tools will be downloaded by SMWCentral.";

  static examples = [];

  async run(): Promise<void> {
    CliUx.ux.action.start("Updating tools");
    const response = await this.api.tool.updateAll();
    if (R.isOk(response)) {
      CliUx.ux.action.stop();
      return;
    }

    const messages = R.messages(response, { verbose: true });
    this.Error(`Failed to update tools\n${messages}`, 1);
  }
}
