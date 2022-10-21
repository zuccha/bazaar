import { Command } from "@oclif/core";

export default class ProjectUberAsmAddFromDirectory extends Command {
  static summary = "Add UberASM code to the project from an directory.";
  static description =
    "Adding UberASM code to the project will not insert it automatically into the ROM hack.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
