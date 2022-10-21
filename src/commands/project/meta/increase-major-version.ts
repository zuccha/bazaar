import { Command } from "@oclif/core";

export default class ProjectMetaIncreaseMajorVersion extends Command {
  static summary = "Increase the major version of the project.";
  static description = `\
Increase the major version of the project by 1, and set the minor and patch\
 versions to 0.

This only works if the version is expressed following the SemVer convention\
 (i.e., "major.minor.patch", "major.minor", "major"). For instance, the\
 following values are supported:
    1.0.6 -> 2.0.0
    0.0.3 -> 1.0.0
    2.1   -> 3.0
    13    -> 14
while these are not:
    v12.2
    FINAL VERSION
    1-alpha
  `;

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
