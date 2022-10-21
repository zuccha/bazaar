import { Command } from "@oclif/core";

export default class ProjectPatchOpenEntryFile extends Command {
  static summary =
    "Open the main ASM file of the given patch into the code editor.";
  static description = "If no code editor is set, this command will fail.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
