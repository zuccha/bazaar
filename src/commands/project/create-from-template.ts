import { Command } from "@oclif/core";

export default class ProjectCreateFromTemplate extends Command {
  static summary = "Create a project from a template.";
  static description = `\
Create a project based on a previously saved template, including all its\
patches, blocks, ...

A project template can be created by saving an already existing project as a\
 template.
The new project will be created in a new directory named after the project, in\
 the current directory.`;

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
