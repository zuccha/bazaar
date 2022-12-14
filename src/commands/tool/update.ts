import { ToolErrorCode } from "../../api/managers/tool-collection/tool";
import { R } from "../../api/utils/result";
import { getTool, ToolName } from "../../commands-utils/tool";
import BaseCommand from "../../utils/base-command";

export default class ToolUpdateCommand extends BaseCommand<
  typeof ToolUpdateCommand
> {
  static summary = "Update a given tool to the version supported by Bazaar";
  static description = `\
The new version of the tool will be downloaded by SMWCentral.

Only a tool with status deprecated can be updated. If a tool is not deprecated,\
 the command will fail.

Updating a tool will not cause any other version of the tool installed manually\
 by the user on the same machine to be updated.`;

  static examples = ["bazaar tool update addmusick"];

  static args = [
    {
      name: "tool-name",
      required: true,
      description: "Name of the tool",
      options: Object.values(ToolName),
    },
  ];

  async run(): Promise<void> {
    const { args } = await this.parse(ToolUpdateCommand);

    const toolName: ToolName = args["tool-name"];

    this.Info.start(`Updating ${toolName}`);
    const result = await getTool(this.api.tools, toolName).update();
    if (R.isOk(result)) {
      this.Info.success();
      return;
    }

    if (result.code === ToolErrorCode.ToolUpToDate) {
      this.Info.failure();
      this.Warning.log(`${toolName} is up to date!`);
      return;
    }

    if (result.code === ToolErrorCode.ToolNotInstalled) {
      this.Info.failure();
      this.Warning.log(`${toolName} is not installed!`);
      return;
    }

    this.Info.failure();
    this.Error(result, `Failed to update ${toolName}`);
  }
}
