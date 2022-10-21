import { Command } from "@oclif/core";

export default class ProjectPatchSaveAsTemplate extends Command {
  static summary = "Save a given patch as a template.";
  static description = `\
Saving a patch as a template means it can be used later to add the same patch\
 to a different project.

Saving a patch as a template includes all of its ASM files.`;

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
