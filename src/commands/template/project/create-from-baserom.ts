import { Flags } from "@oclif/core";
import { ProjectErrorCode } from "../../../api/managers/project";
import { R } from "../../../api/utils/result";
import {
  ProjectConfigFlags,
  ProjectTemplateFlags,
} from "../../../commands-utils/project";
import BaseCommand from "../../../utils/base-command";

export default class TemplateProjectCreateFromBaseromCommand extends BaseCommand<
  typeof TemplateProjectCreateFromBaseromCommand
> {
  static summary = "Create a new project template starting from a baserom";
  static description = `\
The project template will contain only the baserom (no patches, blocks, etc.).`;

  static examples = [
    "bazaar template project create-from-baserom --name=test-hack --baserom=~\\vanilla-smw.smc",
    "bazaar template project create-from-baserom --name=test-hack --baserom=~\\vanilla-smw.smc --author=zuccha --author=john.doe",
    "bazaar template project create-from-baserom --name=test-hack --baserom=~\\vanilla-smw.smc --version=0.1.0",
    "bazaar template project create-from-baserom --name=test-hack --baserom=~\\vanilla-smw.smc --author=zuccha --version=0.1.0",
  ];

  static flags = {
    ...ProjectConfigFlags,
    ...ProjectTemplateFlags,
    baserom: Flags.string({
      summary: "Path to the baserom",
      description:
        "The baserom must be a working smc ROM. This must be a valid path.",
      required: true,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(TemplateProjectCreateFromBaseromCommand);

    this.Info.start(`Creating project template ${flags.name}`);
    const projectTemplate = this.api.templates.project(flags.name);
    const result = await projectTemplate.createFromBaserom(flags.baserom, {
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
