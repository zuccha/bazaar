import { Command } from "@oclif/core";

export default class ProjectMetaEdit extends Command {
  static summary = "Edit the properties of the current project.";
  static description = "The properties include name, authors, and version.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
