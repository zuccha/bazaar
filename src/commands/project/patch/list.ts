import { Command } from "@oclif/core";

export default class ProjectPatchList extends Command {
  static summary = "List all patches added to the project.";
  static description = `\
Patches consist of one or more ASM code files.
Patches are inserted into the ROM hack via Asar.`;

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
