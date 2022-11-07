import { Flags } from "@oclif/core";
import { PatchErrorCode } from "../../../api/managers/project/patch-collection/patch";
import { R } from "../../../api/utils/result";
import { PatchConfigFlags, PatchFlags } from "../../../commands-utils/patch";
import {
  getValidateProjectErrorMessage,
  isValidateProjectErrorCode,
  ProjectFlags,
} from "../../../commands-utils/project";
import BaseCommand from "../../../utils/base-command";

export default class ProjectPatchAddFromFileCommand extends BaseCommand<
  typeof ProjectPatchAddFromFileCommand
> {
  static summary = "Add a patch to the project from an ASM file";
  static description = `\
Adding a patch to the project will not insert it automatically into the ROM hack.

Adding a patch to a project will copy the original file, creating a new one.\
 The original file will not be impacted by any operation made by this tool.

If you want to add a patch with multiple files, check
$ bazaar project patch add-from-directory --help`;

  static examples = [
    'bazaar project patch add-from-file --name="Fix Bug" --file=..\\patches\\fix-bug.asm',
  ];

  static flags = {
    ...ProjectFlags,
    ...PatchFlags,
    ...PatchConfigFlags,

    file: Flags.string({
      summary: "Patch ASM file",
      description: "File containing the ASM code for the patch.",
      required: true,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(ProjectPatchAddFromFileCommand);

    this.Info.start("Adding patch from file");
    const patchResult = await this.api.project(flags.path).patch(flags.name);

    if (R.isError(patchResult)) {
      this.Info.failure();

      if (isValidateProjectErrorCode(patchResult.code)) {
        this.Warning.log(
          getValidateProjectErrorMessage(patchResult.code, flags.path),
        );
        return;
      }

      this.Error(patchResult, `Failed to get project`);
      return;
    }

    const patch = patchResult.data;
    const result = await patch.createFromSingleFile(flags.file, {
      ...(this.flags.author ? { authors: this.flags.author } : {}),
      ...(this.flags.version ? { version: this.flags.version } : {}),
    });

    if (R.isOk(result)) {
      this.Verbose.success();
      return;
    }

    if (result.code === PatchErrorCode.PatchAlreadyExists) {
      this.Info.failure();
      this.Warning.log("A patch with the chosen name already exist");
      return;
    }

    if (result.code === PatchErrorCode.InputMainFileNotFound) {
      this.Info.failure();
      this.Warning.log("The provided ASM file doesn't exist");
      return;
    }

    if (result.code === PatchErrorCode.InputMainFileNotValid) {
      this.Info.failure();
      this.Warning.log("The provided ASM file is not valid");
      return;
    }

    if (result.code === PatchErrorCode.InputMainFileNotAsm) {
      this.Info.failure();
      this.Warning.log('The provided ASM file doesn\'t have ".asm" extension');
      return;
    }

    this.Info.failure();
    this.Error(result, `Failed to add patch from single file`);
  }
}
