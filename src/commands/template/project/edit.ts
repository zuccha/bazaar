import { Command } from "@oclif/core";

export default class TemplateProjectEdit extends Command {
  static summary = "Edit the properties of a project template.";
  static description = `\
Editable properties of a project template include only its name.

Editing a template will not alter any project that was created using it as a\
 starting point.`;

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
