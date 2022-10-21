import { Command } from "@oclif/core";

export default class ProjectMusicEdit extends Command {
  static summary = "Edit the properties of a music track.";
  static description =
    "After editing the music track, the new changes will not automatically be inserted in the ROM hack.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
