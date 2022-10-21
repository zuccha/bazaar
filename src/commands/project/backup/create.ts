import { Command } from "@oclif/core";

export default class ProjectBackupCreate extends Command {
  static summary = "Create a backup of the current project.";
  static description = `\
A backup consists of all resources of a project (blocks, music, patches,\
 sprites, and UberASM code), the baserom, and meta information (authors,\
 version).

A backup does not include releases.`;

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
