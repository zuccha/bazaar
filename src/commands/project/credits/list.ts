import { Command } from "@oclif/core";

export default class ProjectCreditsList extends Command {
  static summary = "List all people that contributed to the ROM hack.";
  static description = `\
Credits consist of the authors of the hack, tools used, and the resources\
 (blocks, music, patches, sprites, and UberAsm code) added to the project.

In addition to those, this will also include any extra credits specified in a\
 CREDITS.txt file present in the root of the project.
`;

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
