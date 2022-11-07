import { ProjectErrorCode } from "../../api/managers/project";
import { R } from "../../api/utils/result";
import {
  getValidateProjectErrorMessage,
  isValidateProjectErrorCode,
  ProjectFlags,
} from "../../commands-utils/project";
import BaseCommand from "../../utils/base-command";

export default class ProjectMetaIncreasePatchVersionCommand extends BaseCommand<
  typeof ProjectMetaIncreasePatchVersionCommand
> {
  static summary = "Increase the patch version of the project";
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

  static examples = [
    "bazaar project increase-patch-version",
    "bazaar project increase-patch-version --path=./MyProject",
  ];

  static flags = ProjectFlags;

  async run(): Promise<void> {
    const { flags } = await this.parse(ProjectMetaIncreasePatchVersionCommand);

    const project = this.api.project(this.flags.path);

    this.Info.start("Increasing patch version");
    const result = await project.increasePatchVersion();

    if (R.isOk(result)) {
      this.Info.success();
      return;
    }

    if (isValidateProjectErrorCode(result.code)) {
      this.Info.failure();
      this.Warning.log(getValidateProjectErrorMessage(result.code, flags.path));
      return;
    }

    if (result.code === ProjectErrorCode.VersionNotValid) {
      this.Info.failure();
      this.Warning.log(`Project version doesn't follow the SemVer format`);
      this.Warning.log(`Version must be one of: "<number>.<number>.<number>"`);
      return;
    }

    this.Info.failure();
    this.Error(result, `Failed to increase patch version`);
  }
}
