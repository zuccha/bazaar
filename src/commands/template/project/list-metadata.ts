import { R } from "../../../api/utils/result";
import {
  getValidateProjectErrorMessage,
  isValidateProjectErrorCode,
  ProjectTemplateFlags,
} from "../../../commands-utils/project";
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

    if (isValidateProjectErrorCode(metadataResult.code)) {
      this.Info.failure();
      this.Warning.log(
        getValidateProjectErrorMessage(
          metadataResult.code,
          flags.name,
          "project template",
        ),
      );
      return;
    }

    this.Error(metadataResult, `Failed to list project template metadata`);
  }
}
