import { Flags } from "@oclif/core";
import Project from "../../api/managers/project";
import { R } from "../../api/utils/result";
import BaseCommand from "../../utils/base-command";

export default class ProjectSaveAsTemplateCommand extends BaseCommand<
  typeof ProjectSaveAsTemplateCommand
> {
  static summary = "Save the current project as a template";
  static description = `\
Saving a project as a template means it can be used later to create new\
 projects with the same structure.

Saving a project as a template includes:
- baserom
- meta data (authors, version)
- resources (blocks, music, patches, sprites, UberASM code)`;

  static examples = [
    'bazaar project save-as-template --template="Foobar Template"',
    'bazaar project save-as-template --template="Foobar Template" --path=./projects/MyProject',
  ];

  static flags = {
    template: Flags.string({
      summary: "Name of the template",
      description:
        "Project templates can be listed with `bazaar template project list`.",
      required: true,
    }),
    path: Flags.string({
      summary: "Directory where the project will be created",
      description: 'The project folder will be "<path>\\<name>".',
      default: ".",
      required: false,
    }),
    force: Flags.boolean({
      summary: "Force saving the project as a template",
      description:
        "If a template with the chosen name already exists, it will be overridden.",
      default: false,
      required: false,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(ProjectSaveAsTemplateCommand);

    this.Info.start(`Saving project as template ${flags.template}`);
    const projectTemplate = this.api.templates.project(flags.template);

    const options = { force: flags.force };
    const result = await projectTemplate.createFromProject(flags.path, options);

    if (R.isOk(result)) {
      this.Info.success();
      return;
    }

    if (result.code === Project.ErrorCode.ProjectNotFound) {
      this.Info.failure();
      this.Warning.log(`The project "${flags.path}" does not exist`);
      return;
    }

    if (result.code === Project.ErrorCode.ProjectNotValid) {
      this.Info.failure();
      const message = `The project "${flags.path}" is not valid (missing baserom, invalid config, etc.)`;
      this.Warning.log(message);
      return;
    }

    if (result.code === Project.ErrorCode.SnapshotTargetExists) {
      this.Info.failure();
      this.Warning.log(`The template "${flags.template}" already exists`);
      return;
    }

    this.Info.failure();
    const messages = R.messages(result, { verbose: true });
    this.Error(`Failed to save project as template\n${messages}`, 1);
  }
}
