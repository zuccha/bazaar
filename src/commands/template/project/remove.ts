import { Command } from "@oclif/core";

export default class TemplateProjectRemove extends Command {
  static summary = "Remove a project from the list of available templates.";
  static description =
    "Removing a project from the list of available templates will not impact any project that used it as a starting point.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
