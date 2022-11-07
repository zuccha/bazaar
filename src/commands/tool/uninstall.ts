import { ToolErrorCode } from "../../api/managers/tool-collection/tool";
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

    this.Info.start(`Uninstalling ${toolName}`);
    const result = await getTool(this.api.tools, toolName).uninstall();
    if (R.isOk(result)) {
      this.Info.success();
      return;
    }

    if (result.code === ToolErrorCode.ToolNotInstalled) {
      this.Info.failure();
      this.Warning.log(`${toolName} is not installed!`);
      this.Warning.log("Install the tool before uninstalling it ;)");
      return;
    }

    this.Info.failure();
    this.Error(result, `Failed to uninstall ${toolName}`);
  }
}
