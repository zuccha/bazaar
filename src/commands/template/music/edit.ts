import { Command } from "@oclif/core";

export default class TemplateMusicEdit extends Command {
  static summary = "Edit the properties of a music track template.";
  static description = `\
Properties of a music track template include its name, authors, version, track\
 file, and sample files.

Editing a template will not alter any project that used the template to add a\
music track.`;

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
