import { ProjectFlags } from "../../../commands-utils/project";
import BaseCommand from "../../../utils/base-command";

export default class ProjectPatchListCommand extends BaseCommand<
  typeof ProjectPatchListCommand
> {
  static summary = "List all patches added to the project";
  static description = `\
Patches consist of one or more ASM code files.

Patches are inserted into the ROM hack via Asar.

If a patch has been added to the project, it doesn't mean it was added to the\
 ROM. To add a patch to the ROM, you must apply it. Adding a patch to the\
 project only mean it can be applied to it.`;

  static flags = ProjectFlags;

  static examples = [
    "bazaar project patch list",
    "bazaar project patch list --path=./MyProject",
  ];

  async run(): Promise<void> {
    const { flags } = await this.parse(ProjectPatchListCommand);

    const patchInfosResult = this.api.project(flags.path).listPatches();
  }
}
