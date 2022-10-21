import { Command } from "@oclif/core";

export default class ProjectMetaIncreasePatchVersion extends Command {
  static summary = "Increase the patch version of the project.";
  static description = `\
Increase the patch version of the project by 1.

This only works if the version is expressed following the SemVer convention\
 up to the patch (i.e., "major.minor.patch"). For instance, the following\
 values are supported:
    1.0.6 -> 1.0.7
    0.0.9 -> 0.0.10
while these are not:
    13
    2.1
    v12.2
    FINAL VERSION
    1-alpha
  `;

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
