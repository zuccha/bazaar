import { Command } from "@oclif/core";

export default class ProjectMusicList extends Command {
  static summary = "List all music track added to the project.";
  static description = `\
Music tracks consist of a ".txt" file containing notes and, optionally, sample
files.
Music tracks are inserted into the ROM hack via AddmusicK.`;

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
