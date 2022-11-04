import Project from "../../../api/managers/project";
import { R } from "../../../api/utils/result";
import { ProjectTemplateFlags } from "../../../commands-utils/project";
import BaseCommand from "../../../utils/base-command";

export default class TemplateProjectListMetadataCommand extends BaseCommand<
  typeof TemplateProjectListMetadataCommand
> {
  static summary = "List metadata of project template";
  static description = "Metadata include the list of authors and the version.";

  static examples = [`bazaar template project list-metadata --name=RHR`];

  static flags = ProjectTemplateFlags;

  async run(): Promise<void> {
    const { flags } = await this.parse(TemplateProjectListMetadataCommand);

    const projectTemplate = this.api.templates.project(flags.name);
    const metadataResult = await projectTemplate.getMetadata();

    if (R.isOk(metadataResult)) {
      const { authors, version } = metadataResult.data;
      this.log(`Authors: ${authors.length > 0 ? authors.join(", ") : "-"}`);
      this.log(`Version: ${version || "-"}`);
      return;
    }

    if (metadataResult.code === Project.ErrorCode.ProjectNotFound) {
      this.Warning.log(`The project template "${flags.name}" does not exist`);
      return;
    }

    if (metadataResult.code === Project.ErrorCode.ProjectNotValid) {
      const message = `"${flags.name}" is not a valid project template (missing baserom, invalid config, etc.)`;
      this.Warning.log(message);
      return;
    }

    const messages = R.messages(metadataResult, { verbose: true });
    this.Error(`Failed to list project template metadata\n${messages}`, 1);
  }
}
