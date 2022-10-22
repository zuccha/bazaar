import { CliUx } from "@oclif/core";
import ToolManager, { ToolManagerError } from "../../api/managers/tool-manager";
import { SupportedToolName } from "../../api/managers/tool-manager/supported-tool";
import { R } from "../../api/utils/result";
import BaseCommand from "../../utils/base-command";

export default class ToolUninstallCommand extends BaseCommand<
  typeof ToolUninstallCommand
> {
  static summary = "Uninstall a given tool.";
  static description =
    "Once uninstalled, you will have to re-install the tool to use related features.";

  static examples = [];

  static args = [
    {
      name: "tool-name",
      required: true,
      description: "Name of the tool",
      options: ToolManager.ToolNames,
    },
  ];

  async run(): Promise<void> {
    const { args } = await this.parse(ToolUninstallCommand);

    const toolName: SupportedToolName = args["tool-name"];

    CliUx.ux.action.start(`Uninstalling ${toolName}`);
    const response = await this.api.tool.uninstall(toolName);
    if (R.isOk(response)) {
      CliUx.ux.action.stop();
      return;
    }

    if (response.code === ToolManagerError.ToolNotInstalled) {
      this.Warn(`${toolName} is not installed!`);
      this.Warn("Install the tool before uninstalling it ;)");
      CliUx.ux.action.stop("interrupted");
      return;
    }

    const messages = R.messages(response, { verbose: true });
    this.Error(`Failed to uninstall ${toolName}\n${messages}`, 1);
  }
}
