import { Command } from "@oclif/core";

export default class ProjectBlockSaveAsTemplate extends Command {
  static summary = "Save a given block as a template.";
  static description = `\
Saving a block as a template means it can be used later to add the same block\
  to a different project.

Saving a block as a template includes its ASM file, id, and save-as numbers.`;

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
