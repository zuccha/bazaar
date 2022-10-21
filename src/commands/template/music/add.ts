import { Command } from "@oclif/core";

export default class TemplateMusicAdd extends Command {
  static summary = "Add a new music as a template.";
  static description =
    "Music templates can be saved for later use in different projects.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
