import { Command } from "@oclif/core";

export default class TemplateBlockAdd extends Command {
  static summary = "Add a new block as a template.";
  static description =
    "Block templates can be saved for later use in different projects.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
