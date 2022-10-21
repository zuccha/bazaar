import { Command } from "@oclif/core";

export default class OriginalRomRemove extends Command {
  static summary = "Remove the original, vanilla ROM of SMW.";
  static description = "Bazar uses the original ROM to create BPS files.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
