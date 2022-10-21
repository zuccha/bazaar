import { Command } from "@oclif/core";

export default class ToolSetCodeEditor extends Command {
  static summary = "Set the code editor.";
  static description =
    "The code editor will be used by Bazar to open ASM files and directories.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
