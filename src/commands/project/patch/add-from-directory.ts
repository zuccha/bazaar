import { Command } from "@oclif/core";

export default class ProjectPatchAddFromDirectory extends Command {
  static summary = "Add a patch to the project from an directory.";
  static description = `\
Adding a patch to the project will not insert it automatically into the ROM hack.

This is useful when a patch consists of multiple files. An entry file must be\
 provided as well.`;

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
