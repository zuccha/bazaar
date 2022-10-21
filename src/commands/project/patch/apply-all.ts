import { Command } from "@oclif/core";

export default class ProjectPatchApplyAll extends Command {
  static summary = "Apply all patches to the ROM.";
  static description =
    "Apply all patches added to the project into the ROM hack via Asar.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
