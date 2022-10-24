import { CliUx } from "@oclif/core";
import { R } from "../../api/utils/result";
import BaseCommand from "../../utils/base-command";

export default class ToolUpdateAllCommand extends BaseCommand<
  typeof ToolUpdateAllCommand
> {
  static summary = "Update all tools to their last version supported by Bazar";
  static description = `\
The new versions of the tools will be downloaded by SMWCentral.

Only a tool with status deprecated can be updated. If a tool is not deprecated,\
 it will be ignored.

Updating a tool will not cause any other version of the tool installed manually\
 by the user on the same machine to be updated.`;

  static examples = ["bazar tool update-all"];

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
