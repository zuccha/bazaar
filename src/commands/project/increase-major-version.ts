import { ConfigurableErrorCode } from "../../api/managers/configurable";
import { ProjectErrorCode } from "../../api/managers/project";
import { ResourceErrorCode } from "../../api/managers/resource";
import { R } from "../../api/utils/result";
import { ProjectFlags } from "../../commands-utils/project";
import BaseCommand from "../../utils/base-command";

export default class ProjectMetaIncreaseMajorVersionCommand extends BaseCommand<
  typeof ProjectMetaIncreaseMajorVersionCommand
> {
  static summary = "Increase the major version of the project";
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

  static examples = [
    "bazaar project increase-major-version",
    "bazaar project increase-major-version --path=./MyProject",
  ];

  static flags = ProjectFlags;

  async run(): Promise<void> {
    const { flags } = await this.parse(ProjectMetaIncreaseMajorVersionCommand);

    const project = this.api.project(this.flags.path);

    this.Info.start("Increasing major version");
    const result = await project.increaseMajorVersion();

    if (R.isOk(result)) {
      this.Info.success();
      return;
    }

    if (result.code === ResourceErrorCode.DirectoryNotFound) {
      this.Info.failure();
      this.Warning.log(`The project "${flags.path}" does not exist`);
      return;
    }

    if (result.code === ConfigurableErrorCode.ConfigNotFound) {
      this.Info.failure();
      const message = `The project "${flags.path}" is not valid, no config was found`;
      this.Warning.log(message);
      return;
    }

    if (result.code === ConfigurableErrorCode.ConfigNotValid) {
      this.Info.failure();
      const message = `The project "${flags.path}" is not valid, the config is not valid`;
      this.Warning.log(message);
      return;
    }

    if (result.code === ProjectErrorCode.BaseromNotFound) {
      this.Info.failure();
      const message = `The project "${flags.path}" is not valid, no baserom was found`;
      this.Warning.log(message);
      return;
    }

    if (result.code === ProjectErrorCode.BaseromNotValid) {
      this.Info.failure();
      const message = `The project "${flags.path}" is not valid, the baserom is not valid`;
      this.Warning.log(message);
      return;
    }

    if (result.code === ProjectErrorCode.VersionNotValid) {
      this.Info.failure();
      this.Warning.log(`Project version doesn't follow the SemVer format`);
      this.Warning.log(
        `Version must be one of: "<number>.<number>.<number>", "<number>.<number>", or "<number>"`,
      );
      return;
    }

    this.Info.failure();
    const messages = R.messages(result, { verbose: true });
    this.Error(`Failed to increase major version\n${messages}`, 1);
  }
}
