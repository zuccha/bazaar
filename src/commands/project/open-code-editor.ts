import { Command } from "@oclif/core";

export default class ProjectOpenCodeEditor extends Command {
  static summary = "Open the project in the code editor tool.";
  static description = `\
Open the root directory in the code editor set via the 'tool' command.
Bazaar will open the project running \`/path/to/code/editor .\`.
If no code editor is set, this command will fail.`;

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
