import { Command } from "@oclif/core";

export default class ProjectUberAsmList extends Command {
  static summary = "List all UberASM code added to the project.";
  static description = `\
UberASM code consist of TODO.
UberASM code is inserted into the ROM hack via UberASM.`;

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
