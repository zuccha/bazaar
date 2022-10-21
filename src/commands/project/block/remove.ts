import { Command } from "@oclif/core";

export default class ProjectBlockRemove extends Command {
  static summary = "Remove a given block from the current project.";
  static description =
    "Removing a block from a project will not automatically remove it from the ROM hack.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
