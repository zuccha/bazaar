import { CliUx } from "@oclif/core";
import { R } from "../../../api/utils/result";
import BaseCommand from "../../../utils/base-command";

export default class TemplateProjectListCommand extends BaseCommand<
  typeof TemplateProjectListCommand
> {
  static summary = "List all project templates";
  static description = `\
Project templates are projects that have been saved and can be to create new\
 projects.`;

  static examples = ["bazaar template project list"];

  async run(): Promise<void> {
    const projectTemplateInfosResult = await this.api.templates.listProjects();
    if (R.isError(projectTemplateInfosResult)) {
      const messages = R.messages(projectTemplateInfosResult, {
        verbose: true,
      });
      this.Error(`Failed to create project\n${messages}`, 1);
      return;
    }

    CliUx.ux.table(projectTemplateInfosResult.data, {
      name: {},
    });
  }
}
