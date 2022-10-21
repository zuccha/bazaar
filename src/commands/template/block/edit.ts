import { Command } from "@oclif/core";

export default class TemplateBlockEdit extends Command {
  static summary = "Edit the properties of a block template.";
  static description = `\
Properties of a block template include its name, authors, version, id, act-as\
 number, and ASM files.

Editing a template will not alter any project that used the template to add a\
 block.`;

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
