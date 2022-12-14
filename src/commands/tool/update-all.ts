import { R } from "../../api/utils/result";
import BaseCommand from "../../utils/base-command";

export default class ToolUpdateAllCommand extends BaseCommand<
  typeof ToolUpdateAllCommand
> {
  static summary = "Update all tools to their last version supported by Bazaar";
  static description = `\
The new versions of the tools will be downloaded by SMWCentral.

Only a tool with status deprecated can be updated. If a tool is not deprecated,\
 it will be ignored.

Updating a tool will not cause any other version of the tool installed manually\
 by the user on the same machine to be updated.`;

  static examples = ["bazaar tool update-all"];

  async run(): Promise<void> {
    this.Info.start("Updating tools");
    const result = await this.api.tools.updateAll();
    if (R.isOk(result)) {
      this.Info.success();
      return;
    }

    this.Info.failure();
    this.Error(result, `Failed to update tools`);
  }
}
