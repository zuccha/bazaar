import { Command } from "@oclif/core";

export default class ToolSetEmulator extends Command {
  static summary = "Set the emulator.";
  static description =
    "The emulator will be used by Bazar to run the ROM hack.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
