import { Command } from "@oclif/core";

export default class ProjectMusicSaveAsTemplate extends Command {
  static summary = "Save a given music track as a template.";
  static description = `\
Saving a music track as a template means it can be used later to add the same\
 track to a different project.

Saving a music track as a template includes its track (txt) file and all\
 samples.`;

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
