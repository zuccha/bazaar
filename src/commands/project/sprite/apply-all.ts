import { Command } from "@oclif/core";

export default class ProjectSpriteApplyAll extends Command {
  static summary = "Insert all sprites into the ROM.";
  static description =
    "Insert all sprites added to the project into the ROM hack via Pixie.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
