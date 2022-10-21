import { Command } from "@oclif/core";

export default class ProjectBlockEdit extends Command {
  static summary = "Edit the properties of a block.";
  static description =
    "After editing the block, the new changes will not automatically be inserted in the ROM hack.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
