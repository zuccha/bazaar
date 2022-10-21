import { Command } from "@oclif/core";

export default class ProjectSaveAsTemplate extends Command {
  static summary = "Save the current project as a template.";
  static description = `\
Saving a project as a template means it can be used later to create new\
 projects with the same structure.

Saving a project as a template includes: ROM, blocks, music, patches, sprites,\
 and UberASM code.`;

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
