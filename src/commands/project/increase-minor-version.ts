import { ConfigurableErrorCode } from "../../api/managers/configurable";
import { ProjectErrorCode } from "../../api/managers/project";
import { ResourceErrorCode } from "../../api/managers/resource";
import { R } from "../../api/utils/result";
import { ProjectFlags } from "../../commands-utils/project";
import BaseCommand from "../../utils/base-command";

export default class ProjectMetaIncreaseMinorVersionCommand extends BaseCommand<
  typeof ProjectMetaIncreaseMinorVersionCommand
> {
  static summary = "Increase the minor version of the project";
  static description = `\
Increase the minor version of the project by 1, and set the patch version to 0.

This only works if the version is expressed following the SemVer convention\
 up to the minor (i.e., "major.minor.patch", "major.minor"). For instance, the\
 following values are supported:
    1.0.6 -> 1.1.0
    0.0.3 -> 0.1.0
    2.1   -> 2.2
while these are not:
    13
    v12.2
    FINAL VERSION
    1-alpha
  `;

  static examples = [
    "bazaar project increase-minor-version",
    "bazaar project increase-minor-version --path=./MyProject",
  ];

  static flags = ProjectFlags;

  async run(): Promise<void> {
    const { flags } = await this.parse(ProjectMetaIncreaseMinorVersionCommand);

    const project = this.api.project(this.flags.path);

    this.Info.start("Increasing minor version");
    const result = await project.increaseMinorVersion();

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
        `Version must be one of: "<number>.<number>.<number>" or "<number>.<number>"`,
      );
      return;
    }

    this.Info.failure();
    const messages = R.messages(result, { verbose: true });
    this.Error(`Failed to increase minor version\n${messages}`, 1);
  }
}
