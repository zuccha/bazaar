import { Command } from "@oclif/core";

export default class TemplateUberAsmRemove extends Command {
  static summary = "Remove UberASM code from the list of available templates.";
  static description =
    "Removing UberASM code from the list of available templates will not remove it from any project that used it.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
