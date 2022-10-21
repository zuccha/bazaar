import { Command } from "@oclif/core";

export default class TemplatePatchAdd extends Command {
  static summary = "Add a new patch as a template.";
  static description =
    "Patch templates can be saved for later use in different projects.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
