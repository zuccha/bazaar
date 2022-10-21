import { Command } from "@oclif/core";

export default class ToolUninstall extends Command {
  static summary = "Uninstall a given tool.";
  static description =
    "Once uninstalled, you will have to re-install the tool to use related features.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
