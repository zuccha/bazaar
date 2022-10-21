import { Command } from "@oclif/core";

export default class ProjectBlockAddFromFile extends Command {
  static summary = "Add a block to the project from an ASM file.";
  static description =
    "Adding a block to the project will not insert it automatically into the ROM hack.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
