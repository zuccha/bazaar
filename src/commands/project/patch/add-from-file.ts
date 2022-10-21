import { Command } from "@oclif/core";

export default class ProjectPatchAddFromFile extends Command {
  static summary = "Add a patch to the project from an ASM file.";
  static description =
    "Adding a patch to the project will not insert it automatically into the ROM hack.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
