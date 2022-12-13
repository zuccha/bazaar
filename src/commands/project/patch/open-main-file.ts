import { R } from "../../../api/utils/result";
import {
  getExecuteCodeEditorErrorMessage,
  isExecuteCodeEditorErrorCode,
} from "../../../commands-utils/editor";
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

export default class ProjectPatchOpenMainFileCommand extends BaseCommand<
  typeof ProjectPatchOpenMainFileCommand
> {
  static summary = "Open the main patch file into the code editor";
  static description = "If no code editor is set, this command will fail.";

  static examples = ['bazaar project patch open-main-file --name="Fix Rope"'];

  static flags = {
    ...ProjectFlags,
    ...PatchFlags,
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(ProjectPatchOpenMainFileCommand);

    this.Info.start("Opening patch main file in code editor");
    const patchResult = await this.api.project(flags.path).patch(flags.name);

    if (R.isError(patchResult)) {
      this.Info.failure();

      if (isValidateProjectErrorCode(patchResult.code)) {
        this.Warning.log(
          getValidateProjectErrorMessage(patchResult.code, flags.path),
        );
        return;
      }

      this.Error(patchResult, `Failed to open patch main file in code editor`);
      return;
    }

    const patch = patchResult.data;
    const result = await patch.openMainFile();

    if (R.isOk(result)) {
      this.Info.success();
      return;
    }

    if (isValidatePatchErrorCode(result.code)) {
      this.Info.failure();
      this.Warning.log(getValidatePatchErrorMessage(result.code, flags.name));
      return;
    }

    if (isExecuteCodeEditorErrorCode(result.code)) {
      this.Info.failure();
      this.Warning.log(
        getExecuteCodeEditorErrorMessage(result.code, flags.path),
      );
      return;
    }

    this.Info.failure();
    this.Error(result, `Failed to open patch main file in code editor`);
  }
}
