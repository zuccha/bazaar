import { Command } from "@oclif/core";

export default class ProjectOpenLunarMagic extends Command {
  static summary = "Open the ROM in Lunar Magic.";
  static description = `\
Open the ROM in Lunar Magic.
If Lunar Magic is not installed, this command will fail. To install Lunar\
 Magic, run \`bazar tool install lunar-magic\`.`;

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
