import { Command } from "@oclif/core";

export default class ToolInstall extends Command {
  static summary = "Install a given tool.";
  static description = "The tool will be downloaded from SMWCentral.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
