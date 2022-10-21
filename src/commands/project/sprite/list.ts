import { Command } from "@oclif/core";

export default class ProjectSpriteList extends Command {
  static summary = "List all sprites added to the project.";
  static description = `\
Sprites consist of a single ASM code file and TODO.
Sprites are inserted into the ROM hack via Pixie.`;

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
