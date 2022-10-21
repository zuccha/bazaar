import { Command } from "@oclif/core";

export default class ProjectMetaList extends Command {
  static summary = "List meta data of the current project.";
  static description =
    "The meta data consist of the name, authors, and version.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
