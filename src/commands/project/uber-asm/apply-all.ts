import { Command } from "@oclif/core";

export default class ProjectUberAsmApplyAll extends Command {
  static summary = "Apply all UberASM code to the ROM.";
  static description =
    "Apply all UberASM code added to the project into the ROM hack via UberASM.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
