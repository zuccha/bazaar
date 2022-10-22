import { CliUx, Flags } from "@oclif/core";
import ToolManager, { ToolManagerError } from "../../api/managers/tool-manager";
import { R } from "../../api/utils/result";
import BaseCommand from "../../utils/base-command";
import ToolListCommand from "./list";

export default class ToolInstallCommand extends BaseCommand<
  typeof ToolListCommand
> {
  static summary = "Install a given tool.";
  static description = `\
The tool will be downloaded from SMWCentral.
If the tool (even an old version) is already installed, this command will fail.\
 To circumvent this issue, use the \`--force\` flag.`;

  static examples = [];

  static args = [
    {
      name: "tool-name",
      required: true,
      description: "Name of the tool",
      options: ToolManager.ToolNames,
    },
  ];

  static flags = {
    force: Flags.boolean({
      char: "f",
      summary: "Install the tool even if another version is already present.",
      description:
        "Force-installing a tool will remove other versions of the tool previously installed.",
      default: false,
    }),
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(ToolInstallCommand);

    const toolName = args["tool-name"];

    CliUx.ux.action.start(`Installing ${toolName}`);
    const response = await this.api.tool.install(toolName, {
      force: flags.force,
    });
    if (R.isOk(response)) {
      CliUx.ux.action.stop();
      return;
    }

    if (response.code === ToolManagerError.ToolAlreadyInstalled) {
      this.Warn(`${toolName} is already installed!`);
      this.Warn("Run with `--force` if you want to force the installation");
      this.Warn(`  bazar tool install ${toolName} --force`);
      CliUx.ux.action.stop("interrupted");
      return;
    }

    const messages = R.messages(response, { verbose: true });
    this.Error(`Failed to install ${toolName}\n${messages}`, 1);
  }
}
