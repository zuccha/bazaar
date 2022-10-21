import { Command } from "@oclif/core";

export default class ToolInstallAll extends Command {
  static summary = "Install all tools required by Bazar.";
  static description = "The tools will be downloaded by SMWCentral.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
