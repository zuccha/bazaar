import { Command } from "@oclif/core";

export default class ProjectUberAsmRemove extends Command {
  static summary = "Remove given UberASM code from the current project.";
  static description =
    "Removing UberASM code from a project will not automatically remove it from the ROM hack.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
