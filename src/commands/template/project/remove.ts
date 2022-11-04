import Project from "../../../api/managers/project";
import { R } from "../../../api/utils/result";
import { ProjectTemplateFlags } from "../../../commands-utils/project";
import BaseCommand from "../../../utils/base-command";

export default class TemplateProjectRemoveCommand extends BaseCommand<
  typeof TemplateProjectRemoveCommand
> {
  static summary = "Remove a project from the list of available templates";
  static description = `\
N.B.: This action is not reversible!

Removing a project from the list of available templates will not impact any project that used it as a starting point.`;

  static examples = ["bazaar template project remove --name=RHR"];

  static flags = ProjectTemplateFlags;

  async run(): Promise<void> {
    const { flags } = await this.parse(TemplateProjectRemoveCommand);

    this.Info.start("Removing project template");
    const projectTemplate = this.api.templates.project(flags.name);
    const result = await projectTemplate.remove();

    if (R.isOk(result)) {
      this.Info.success();
      return;
    }

    if (result.code === Project.ErrorCode.ProjectNotFound) {
      this.Info.failure();
      this.Warning.log(`The project template "${flags.name}" does not exist`);
      return;
    }

    if (result.code === Project.ErrorCode.ProjectNotValid) {
      this.Info.failure();
      const message = `The project template "${flags.name}" is not valid (missing baserom, invalid config, etc.)`;
      this.Warning.log(message);
      return;
    }

    this.Info.failure();
    const messages = R.messages(result, { verbose: true });
    this.Error(`Failed to remove project template\n${messages}`, 1);
  }
}
