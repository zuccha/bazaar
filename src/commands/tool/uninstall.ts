import Tool from "../../api/managers/tool-collection/tool";
import { R } from "../../api/utils/result";
import { getTool, ToolName } from "../../commands-utils/tool";
import BaseCommand from "../../utils/base-command";

export default class ToolUninstallCommand extends BaseCommand<
  typeof ToolUninstallCommand
> {
  static summary = "Uninstall a given tool";
  static description = `\
Only tools that are already installed can be uninstalled. Trying to uninstall a
non-installed tool will cause an error.

Uninstalling a tool with Bazaar will not cause any other installation made by\
the user on the machine to be uninstalled.`;

  static examples = ["bazaar tool uninstall gps"];

  static args = [
    {
      name: "tool-name",
      required: true,
      description: "Name of the tool",
      options: Object.values(ToolName),
    },
  ];

  async run(): Promise<void> {
    const { args } = await this.parse(ToolUninstallCommand);

    const toolName: ToolName = args["tool-name"];

    this.LogStart(`Uninstalling ${toolName}`);
    const response = await getTool(
      this.api.toolCollection,
      toolName,
    ).uninstall();
    if (R.isOk(response)) {
      this.LogSuccess();
      return;
    }

    if (response.code === Tool.ErrorCode.ToolNotInstalled) {
      this.LogFailure();
      this.Warn(`${toolName} is not installed!`);
      this.Warn("Install the tool before uninstalling it ;)");
      return;
    }

    this.LogFailure();
    const messages = R.messages(response, { verbose: true });
    this.Error(`Failed to uninstall ${toolName}\n${messages}`, 1);
  }
}
