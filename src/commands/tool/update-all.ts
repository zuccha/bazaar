import { Command } from "@oclif/core";

export default class ToolUpdateAll extends Command {
  static summary = "Update all tools to their last version supported by Bazar.";
  static description =
    "The new versions of the tools will be downloaded by SMWCentral.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
