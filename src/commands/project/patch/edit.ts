import { Command } from "@oclif/core";

export default class ProjectPatchEdit extends Command {
  static summary = "Edit the properties of a patch.";
  static description =
    "After editing the patch, the new changes will not automatically be inserted in the ROM hack.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
