import { Command } from "@oclif/core";

export default class ProjectMetaIncreaseMinorVersion extends Command {
  static summary = "Increase the minor version of the project.";
  static description = `\
Increase the minor version of the project by 1, and set the patch version to 0.

This only works if the version is expressed following the SemVer convention\
 up to the minor (i.e., "major.minor.patch", "major.minor"). For instance, the\
 following values are supported:
    1.0.6 -> 1.1.0
    0.0.3 -> 0.1.0
    2.1   -> 2.2
while these are not:
    13
    v12.2
    FINAL VERSION
    1-alpha
  `;

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
