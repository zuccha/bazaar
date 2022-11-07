import { R } from "../../../api/utils/result";
import BaseCommand from "../../../utils/base-command";
import { logCollection } from "../../../utils/collection";

export default class TemplateProjectListCommand extends BaseCommand<
  typeof TemplateProjectListCommand
> {
  static summary = "List all project templates";
  static description = `\
Project templates are projects that have been saved and can be to create new\
 projects.`;

  static examples = ["bazaar template project list"];

  async run(): Promise<void> {
    this.Verbose.start("Listing project templates");
    const projectTemplateInfosResult = await this.api.templates.listProjects();
    if (R.isError(projectTemplateInfosResult)) {
      this.Verbose.failure();
      this.Error(
        projectTemplateInfosResult,
        `Failed to list project templates`,
      );
      return;
    }
    this.Verbose.success();
    logCollection(projectTemplateInfosResult.data);
  }
}
