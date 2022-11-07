import { R } from "../../../api/utils/result";
import {
  getValidateProjectErrorMessage,
  isValidateProjectErrorCode,
  ProjectTemplateFlags,
} from "../../../commands-utils/project";
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

    if (isValidateProjectErrorCode(result.code)) {
      this.Info.failure();
      this.Warning.log(
        getValidateProjectErrorMessage(
          result.code,
          flags.name,
          "project template",
        ),
      );
      return;
    }

    this.Info.failure();
    this.Error(result, `Failed to remove project template`);
  }
}
