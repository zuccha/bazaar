import { Command } from "@oclif/core";

export default class ProjectBlockAddFromTemplate extends Command {
  static summary = "Add a block to the project from an template.";
  static description =
    "Adding a block to the project will not insert it automatically into the ROM hack.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
