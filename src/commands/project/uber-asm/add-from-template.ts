import { Command } from "@oclif/core";

export default class ProjectUberAsmAddFromTemplate extends Command {
  static summary = "Add UberASM code to the project from an template.";
  static description =
    "Adding UberASM code to the project will not insert it automatically into the ROM hack.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
