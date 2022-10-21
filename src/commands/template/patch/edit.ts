import { Command } from "@oclif/core";

export default class TemplatePatchEdit extends Command {
  static summary = "Edit the properties of a patch template.";
  static description = `\
Properties of a patch template include its name, authors, version, ASM files,
 and the entry file name.

Editing a template will not alter any project that used the template to add a\
 patch.`;

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
