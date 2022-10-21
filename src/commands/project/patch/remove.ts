import { Command } from "@oclif/core";

export default class ProjectPatchRemove extends Command {
  static summary = "Remove a given patch from the current project.";
  static description =
    "Removing a patch from a project will not automatically remove it from the ROM hack.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
