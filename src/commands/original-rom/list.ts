import { Command } from "@oclif/core";

export default class OriginalRomList extends Command {
  static summary = "Show the original ROM used by Bazar.";
  static description = "The ROM can be either set or not set.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
