import { Command } from "@oclif/core";

export default class TemplateUberAsmEdit extends Command {
  static summary = "Edit the properties of UberASM code template.";
  static description = `\
Properties of UberASM code template include its name, authors, version, and ASM
 files.\

Editing a template will not alter any project that used the template to add\
 UberASM code.`;

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
