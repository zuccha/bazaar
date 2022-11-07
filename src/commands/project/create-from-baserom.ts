import { Flags } from "@oclif/core";
import { ProjectErrorCode } from "../../api/managers/project";
import { R } from "../../api/utils/result";
import {
  ProjectConfigFlags,
  ProjectCreationFlags,
} from "../../commands-utils/project";
import BaseCommand from "../../utils/base-command";

export default class ProjectCreateFromBaseromCommand extends BaseCommand<
  typeof ProjectCreateFromBaseromCommand
> {
  static summary = "Create a new project starting from a baserom";
  static description = `\
The project will contain only the baserom (no patches, blocks, etc.).

The new project will be created in a new directory named after the project, in\
 the current directory.`;

  static examples = [
    "bazaar project create-from-baserom --name=test-hack --baserom=~\\vanilla-smw.smc",
    "bazaar project create-from-baserom --name=test-hack --baserom=~\\vanilla-smw.smc --path=..",
    "bazaar project create-from-baserom --name=test-hack --baserom=~\\vanilla-smw.smc --author=zuccha --author=john.doe",
    "bazaar project create-from-baserom --name=test-hack --baserom=~\\vanilla-smw.smc --author=zuccha --version=0.1.0",
  ];

  static flags = {
    ...ProjectCreationFlags,
    ...ProjectConfigFlags,
    baserom: Flags.string({
      summary: "Path to the baserom",
      description:
        "The baserom must be a working smc ROM. This must be a valid path.",
      required: true,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(ProjectCreateFromBaseromCommand);

    this.Info.start(`Creating project ${flags.name}`);
    const project = this.api.project(flags.path, flags.name);
    const result = await project.createFromBaserom(flags.baserom, {
      ...(flags.author ? { authors: flags.author } : {}),
      ...(flags.version ? { version: flags.version } : {}),
    });

    if (R.isOk(result)) {
      this.Info.success();
      return;
    }

    if (result.code === ProjectErrorCode.BaseromNotFound) {
      this.Info.failure();
      this.Warning.log("The given baserom was not found");
      return;
    }

    if (result.code === ProjectErrorCode.BaseromNotValid) {
      this.Info.failure();
      this.Warning.log("The given baserom is not a valid file");
      return;
    }

    if (result.code === ProjectErrorCode.ProjectExists) {
      this.Info.failure();
      this.Warning.log("A project with the chosen name already exists");
      return;
    }

    this.Info.failure();
    this.Error(result, `Failed to create project`);
  }
}
