import { Command } from "@oclif/core";

export default class ProjectSpriteOpen extends Command {
  static summary =
    "Open the ASM file of the given sprite into the code editor.";
  static description = "If no code editor is set, this command will fail.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
