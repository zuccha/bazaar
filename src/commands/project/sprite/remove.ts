import { Command } from "@oclif/core";

export default class ProjectSpriteRemove extends Command {
  static summary = "Remove a given sprite from the current project.";
  static description =
    "Removing a sprite from a project will not automatically remove it from the ROM hack.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
