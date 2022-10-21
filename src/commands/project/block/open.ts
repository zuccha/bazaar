import { Command } from "@oclif/core";

export default class ProjectBlockOpen extends Command {
  static summary = "Open the ASM file of the given block into the code editor.";
  static description = "If no code editor is set, this command will fail.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
