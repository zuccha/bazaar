import { Command } from "@oclif/core";

export default class ProjectPatchApply extends Command {
  static summary = "Apply a given patches to the ROM.";
  static description =
    "Apply a patch added to the project into the ROM hack via Asar.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
