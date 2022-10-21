import { Command } from "@oclif/core";

export default class ProjectUberAsmSaveAsTemplate extends Command {
  static summary = "Save given UberASM code as a template.";
  static description = `\
Saving a UberASM code as a template means it can be used later to add the same\
 UberASM code to a different project.

Saving a UberASM code as a template includes all of its ASM files.`;

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
