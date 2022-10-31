import { Command } from "@oclif/core";

export default class ProjectOpenEmulator extends Command {
  static summary = "Run the ROM in the emulator tool.";
  static description = `\
Run the ROM hack in the emulator tool set via the 'tool' command.
Bazaar runs the emulator running \`/path/to/emulator baserom.smc\`.
If no emulator is set, this command will fail.`;

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
