import { Command } from "@oclif/core";

export default class ProjectBlockList extends Command {
  static summary = "List all blocks added to the project.";
  static description = `\
Blocks consist of a single ASM code file, an id (hex number), and an act-as\
 number.
Blocks are inserted into the ROM hack via GPS.`;

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
