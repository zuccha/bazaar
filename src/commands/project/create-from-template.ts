import { Flags } from "@oclif/core";
import Project from "../../api/managers/project";
import { R } from "../../api/utils/result";
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
    template: Flags.string({
      summary: "Name of the template",
      description:
        "Project templates can be listed with `bazaar template project list`.",
      required: true,
    }),
    name: Flags.string({
      summary: "Name of the project",
      description:
        "The name will be used to create a directory inside the chosen <path>.",
      required: true,
    }),
    author: Flags.string({
      summary: "Author of the hack",
      description: "You can specify authors several times.",
      multiple: true,
      required: false,
    }),
    version: Flags.string({
      summary: "Initial version of the project",
      description: "There is no restriction on what the version can be.",
      required: false,
    }),
    path: Flags.string({
      summary: "Directory where the project will be created",
      description: 'The project folder will be "<path>\\<name>".',
      default: ".",
      required: false,
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

    if (result.code === Project.ErrorCode.SnapshotTargetExists) {
      this.Info.failure();
      this.Warning.log(`The project "${flags.name}" already exists`);
      return;
    }

    if (result.code === Project.ErrorCode.ProjectNotFound) {
      this.Info.failure();
      this.Warning.log(`The template "${flags.template}" does not exist`);
      return;
    }

    if (result.code === Project.ErrorCode.ProjectNotValid) {
      this.Info.failure();
      const message = `The template "${flags.template}" is not valid (missing baserom, invalid config, etc.)`;
      this.Warning.log(message);
      return;
    }

    this.Info.failure();
    const messages = R.messages(result, { verbose: true });
    this.Error(`Failed to create project\n${messages}`, 1);
  }
}
