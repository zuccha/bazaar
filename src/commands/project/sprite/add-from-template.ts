import { Command } from "@oclif/core";

export default class ProjectSpriteAddFromTemplate extends Command {
  static summary = "Add a sprite to the project from an template.";
  static description =
    "Adding a sprite to the project will not insert it automatically into the ROM hack.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
