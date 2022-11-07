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

export default class ProjectPatchAddFromDirectoryCommand extends BaseCommand<
  typeof ProjectPatchAddFromDirectoryCommand
> {
  static summary = "Add a patch to the project from a directory";
  static description = `\
Use this command if you want to add a patch that's made of multiple files.

Adding a patch to the project will not insert it automatically into the ROM hack.

Adding a patch to a project will copy all original files, creating a new ones.\
 The original files will not be impacted by any operation made by this tool.

If you want to add a patch with a single file, check
$ bazaar project patch add-from-file --help`;

  static examples = [
    'bazaar project patch add-from-directory --name="Fix Bug" --directory=..\\patches\\fix-bug\\ --main-file=..\\patches\\fix-bug\\main.asm',
  ];

  static flags = {
    ...ProjectFlags,
    ...PatchFlags,
    ...PatchConfigFlags,

    directory: Flags.string({
      summary: "Directory containing all patch files",
      description: "This directory can also contain sub-directories.",
      required: true,
    }),

    "main-file": Flags.string({
      summary: "Main file of patch",
      description: `\
This must be a file with ".asm" extension.

This file must be contained inside the directory specified via the \
<directory> flag.`,
      required: true,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(ProjectPatchAddFromDirectoryCommand);

    this.Info.start("Adding patch from directory");
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
    const result = await patch.createFromDirectory(
      flags.directory,
      flags["main-file"],
      {
        ...(this.flags.author ? { authors: this.flags.author } : {}),
        ...(this.flags.version ? { version: this.flags.version } : {}),
      },
    );

    if (R.isOk(result)) {
      this.Info.success();
      return;
    }

    if (result.code === PatchErrorCode.PatchAlreadyExists) {
      this.Info.failure();
      this.Warning.log("A patch with the chosen name already exist");
      return;
    }

    if (result.code === PatchErrorCode.InputCodeDirectoryNotFound) {
      this.Info.failure();
      this.Warning.log("The provided directory doesn't exist");
      return;
    }

    if (result.code === PatchErrorCode.InputCodeDirectoryNotValid) {
      this.Info.failure();
      this.Warning.log("The provided directory is not valid");
      return;
    }

    if (result.code === PatchErrorCode.InputMainFileNotFound) {
      this.Info.failure();
      this.Warning.log("The provided main ASM file doesn't exist");
      return;
    }

    if (result.code === PatchErrorCode.InputMainFileNotValid) {
      this.Info.failure();
      this.Warning.log("The provided main ASM file is not valid");
      return;
    }

    if (result.code === PatchErrorCode.InputMainFileNotAsm) {
      this.Info.failure();
      this.Warning.log(
        'The provided main ASM file doesn\'t have ".asm" extension',
      );
      return;
    }

    if (result.code === PatchErrorCode.InputMainFileNotInsideCodeDirectory) {
      this.Info.failure();
      this.Warning.log(
        "The provided main ASM file is not contained in the provided directory",
      );
      return;
    }

    this.Info.failure();
    this.Error(result, `Failed to add patch from directory`);
  }
}
