import { Command } from "@oclif/core";

export default class ToolUpdate extends Command {
  static summary =
    "Update a given tool to the last version supported by Bazar.";
  static description =
    "The new version of the tool will be downloaded by SMWCentral.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
