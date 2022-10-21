import { Command } from "@oclif/core";

export default class ProjectMusicOpen extends Command {
  static summary =
    "Open the track (txt) file of the given music track into the code editor.";
  static description = "If no code editor is set, this command will fail.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
