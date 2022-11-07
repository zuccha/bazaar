import { R } from "../../../api/utils/result";
import {
  getValidateProjectErrorMessage,
  isValidateProjectErrorCode,
  ProjectFlags,
} from "../../../commands-utils/project";
import BaseCommand from "../../../utils/base-command";
import { logCollection } from "../../../utils/collection";

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

    this.Verbose.start("Listing patches");
    const patchInfosResult = await this.api.project(flags.path).listPatches();

    if (R.isOk(patchInfosResult)) {
      this.Verbose.success();
      logCollection(patchInfosResult.data);
      return;
    }

    this.Verbose.failure();

    if (isValidateProjectErrorCode(patchInfosResult.code)) {
      this.Info.failure();
      this.Warning.log(
        getValidateProjectErrorMessage(patchInfosResult.code, flags.path),
      );
      return;
    }

    this.Error(patchInfosResult, `Failed to list project patches`);
  }
}
