import { Command } from "@oclif/core";

export default class ProjectCreateFromBaserom extends Command {
  static summary = "Create a new project starting from a baserom.";
  static description = `\
The project will contain only the baserom (no patches, blocks, ...).

The new project will be created in a new directory named after the project, in\
 the current directory.`;

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
