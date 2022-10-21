import { Command } from "@oclif/core";

export default class ProjectSpriteSaveAsTemplate extends Command {
  static summary = "Save a given sprite as a template.";
  static description = `\
Saving a sprite as a template means it can be used later to add the same sprite\
 to a different project.

Saving a sprite as a template includes its ASM file, id, and save-as numbers.`;

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
