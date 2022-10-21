import { Command } from "@oclif/core";

export default class ProjectBlockApplyAll extends Command {
  static summary = "Insert all blocks into the ROM.";
  static description =
    "Insert all blocks added to the project into the ROM hack via GPS.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
