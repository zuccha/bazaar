import { Command } from "@oclif/core";

export default class ProjectUberAsmOpen extends Command {
  static summary =
    "Open the directory of the given UberASM code into the code editor.";
  static description = "If no code editor is set, this command will fail.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
