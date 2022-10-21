import { Command } from "@oclif/core";

export default class ProjectSpriteEdit extends Command {
  static summary = "Edit the properties of a sprite.";
  static description =
    "After editing the sprite, the new changes will not automatically be inserted in the ROM hack.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
