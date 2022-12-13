import { R } from "../../../api/utils/result";
import {
  getValidatePatchErrorMessage,
  isValidatePatchErrorCode,
  PatchFlags,
} from "../../../commands-utils/patch";
import {
  getValidateProjectErrorMessage,
  isValidateProjectErrorCode,
  ProjectFlags,
} from "../../../commands-utils/project";
import BaseCommand from "../../../utils/base-command";

export default class ProjectPatchRemoveCommand extends BaseCommand<
  typeof ProjectPatchRemoveCommand
> {
  static summary = "Remove a patch from the current project.";
  static description =
    "Removing a patch from a project will not automatically remove it from the ROM hack.";

  static examples = ["bazaar project patch remove fix-double-spin"];

  static flags = {
    ...ProjectFlags,
    ...PatchFlags,
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(ProjectPatchRemoveCommand);

    this.Info.start("Removing patch from project");
    const patchResult = await this.api.project(flags.path).patch(flags.name);

    if (R.isError(patchResult)) {
      this.Info.failure();

      if (isValidateProjectErrorCode(patchResult.code)) {
        this.Warning.log(
          getValidateProjectErrorMessage(patchResult.code, flags.path),
        );
        return;
      }

      this.Error(patchResult, `Failed to remove patch from project`);
      return;
    }

    const patch = patchResult.data;
    const result = await patch.remove();

    if (R.isOk(result)) {
      this.Info.success();
      return;
    }

    if (isValidatePatchErrorCode(result.code)) {
      this.Info.failure();
      getValidatePatchErrorMessage(result.code, flags.name);
      return;
    }

    this.Info.failure();
    this.Error(result, `Failed to remove patch from project`);
  }
}
