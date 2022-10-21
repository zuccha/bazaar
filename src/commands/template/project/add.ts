import { Command } from "@oclif/core";

export default class TemplateProjectAdd extends Command {
  static summary = "Add a new project as a template starting from a baserom.";
  static description = "Project templates can be saved to create new projects.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
