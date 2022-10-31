import ToolManager, { ToolManagerError } from "../../api/managers/tool-manager";
import { SupportedToolName } from "../../api/managers/tool-manager/supported-tool";
import { R } from "../../api/utils/result";
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
      options: ToolManager.ToolNames,
    },
  ];

  async run(): Promise<void> {
    const { args } = await this.parse(ToolUpdateCommand);

    const toolName: SupportedToolName = args["tool-name"];

    this.LogStart(`Updating ${toolName}`);
    const response = await this.api.tool.update(toolName);
    if (R.isOk(response)) {
      this.LogSuccess();
      return;
    }

    if (response.code === ToolManagerError.ToolIsUpToDate) {
      this.LogFailure();
      this.Warn(`${toolName} is up to date!`);
      return;
    }

    if (response.code === ToolManagerError.ToolNotInstalled) {
      this.LogFailure();
      this.Warn(`${toolName} is not installed!`);
      return;
    }

    this.LogFailure();
    const messages = R.messages(response, { verbose: true });
    this.Error(`Failed to update ${toolName}\n${messages}`, 1);
  }
}
