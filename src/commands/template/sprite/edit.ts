import { Command } from "@oclif/core";

export default class TemplateSpriteEdit extends Command {
  static summary = "Edit the properties of a sprite template.";
  static description = `\
Properties of a sprite template include its name, authors, version, id, and\
 ASM file.

Editing a template will not alter any project that used the template to add a\
 sprite.`;

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
