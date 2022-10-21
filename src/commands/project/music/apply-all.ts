import { Command } from "@oclif/core";

export default class ProjectMusicApplyAll extends Command {
  static summary = "Insert all music tracks into the ROM.";
  static description =
    "Insert all music tracks added to the project into the ROM hack via AddmusicK.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
