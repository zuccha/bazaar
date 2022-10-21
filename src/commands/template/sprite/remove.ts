import { Command } from "@oclif/core";

export default class TemplateSpriteRemove extends Command {
  static summary = "Remove a sprite from the list of available templates.";
  static description =
    "Removing a sprite from the list of available templates will not remove it from any project that used it.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
