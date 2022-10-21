import { Command } from "@oclif/core";

export default class ProjectUberAsmEdit extends Command {
  static summary = "Edit the properties of UberASM code.";
  static description =
    "After editing the UberASM code, the new changes will not automatically be inserted in the ROM hack.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
