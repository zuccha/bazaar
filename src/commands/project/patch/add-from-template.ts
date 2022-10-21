import { Command } from "@oclif/core";

export default class ProjectPatchAddFromTemplate extends Command {
  static summary = "Add a patch to the project from an template.";
  static description =
    "Adding a patch to the project will not insert it automatically into the ROM hack.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
