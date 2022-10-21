import { Command } from "@oclif/core";

export default class ProjectMusicAddFromFile extends Command {
  static summary = "Add a music track to the project.";
  static description =
    "Adding a music track to the project will not insert it automatically into the ROM hack.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
