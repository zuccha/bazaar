import { Flags } from "@oclif/core";
import { ConfigurableErrorCode } from "../../api/managers/configurable";
import { ProjectErrorCode } from "../../api/managers/project";
import { ResourceErrorCode } from "../../api/managers/resource";
import { R } from "../../api/utils/result";
import {
  ProjectConfigFlags,
  ProjectCreationFlags,
} from "../../commands-utils/project";
import BaseCommand from "../../utils/base-command";

export default class ProjectCreateFromTemplateCommand extends BaseCommand<
  typeof ProjectCreateFromTemplateCommand
> {
  static summary = "Create a project from a template";
  static description = `\
Create a project based on a previously saved template. This includes:
- baserom
- meta data (authors, version)
- resources (blocks, music, patches, sprites, UberASM code)

A project template can be created by saving an already existing project as a\
 template.

The new project will be created in a new directory.`;

  static examples = [
    "bazaar project create-from-template --template=Foobar --name=MyProject",
    "bazaar project create-from-template --template=Foobar --name=MyProject --author=john.doe",
    "bazaar project create-from-template --template=Foobar --name=MyProject --path=../projects",
  ];

  static flags = {
    ...ProjectCreationFlags,
    ...ProjectConfigFlags,
    template: Flags.string({
      summary: "Name of the template",
      description:
        "Project templates can be listed with `bazaar template project list`.",
      required: true,
    }),
    force: Flags.boolean({
      summary: "Force creating the project",
      description:
        "If a project with the chosen name already exists, it will be overridden.",
      default: false,
      required: false,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(ProjectCreateFromTemplateCommand);

    this.Info.start(`Creating project ${flags.name}`);
    const projectTemplate = this.api.templates.project(flags.template);

    const options = { force: flags.force };
    const result = await projectTemplate.initProject(
      flags.path,
      flags.name,
      {
        ...(flags.author ? { authors: flags.author } : {}),
        ...(flags.version ? { version: flags.version } : {}),
      },
      options,
    );

    if (R.isOk(result)) {
      this.Info.success();
      return;
    }

    if (result.code === ResourceErrorCode.DirectoryNotFound) {
      this.Info.failure();
      this.Warning.log(`The template "${flags.path}" doesn't exist`);
      return;
    }

    if (result.code === ConfigurableErrorCode.ConfigNotFound) {
      this.Info.failure();
      const message = `The template "${flags.path}" is not valid, no config was found`;
      this.Warning.log(message);
      return;
    }

    if (result.code === ConfigurableErrorCode.ConfigNotValid) {
      this.Info.failure();
      const message = `The template "${flags.path}" is not valid, the config is not valid`;
      this.Warning.log(message);
      return;
    }

    if (result.code === ProjectErrorCode.BaseromNotFound) {
      this.Info.failure();
      const message = `The template "${flags.path}" is not valid, no baserom was found`;
      this.Warning.log(message);
      return;
    }

    if (result.code === ProjectErrorCode.BaseromNotValid) {
      this.Info.failure();
      const message = `The template "${flags.path}" is not valid, the baserom is not valid`;
      this.Warning.log(message);
      return;
    }

    if (result.code === ResourceErrorCode.SnapshotTargetExists) {
      this.Info.failure();
      this.Warning.log(`The project "${flags.name}" already exists`);
      return;
    }

    this.Info.failure();
    const messages = R.messages(result, { verbose: true });
    this.Error(`Failed to create project\n${messages}`, 1);
  }
}
