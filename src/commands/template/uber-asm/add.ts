import { Command } from "@oclif/core";

export default class TemplateUberAsmAdd extends Command {
  static summary = "Add new UberASM code as a template.";
  static description =
    "UberASM code templates can be saved for later use in different projects.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
