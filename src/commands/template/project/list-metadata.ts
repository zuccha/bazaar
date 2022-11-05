import { ConfigurableErrorCode } from "../../../api/managers/configurable";
import { ProjectErrorCode } from "../../../api/managers/project";
import { ResourceErrorCode } from "../../../api/managers/resource";
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

    if (metadataResult.code === ResourceErrorCode.DirectoryNotFound) {
      this.Info.failure();
      this.Warning.log(`The template "${flags.name}" doesn't exist`);
      return;
    }

    if (metadataResult.code === ConfigurableErrorCode.ConfigNotFound) {
      this.Info.failure();
      const message = `The template "${flags.name}" is not valid, no config was found`;
      this.Warning.log(message);
      return;
    }

    if (metadataResult.code === ConfigurableErrorCode.ConfigNotValid) {
      this.Info.failure();
      const message = `The template "${flags.name}" is not valid, the config is not valid`;
      this.Warning.log(message);
      return;
    }

    if (metadataResult.code === ProjectErrorCode.BaseromNotFound) {
      this.Info.failure();
      const message = `The template "${flags.name}" is not valid, no baserom was found`;
      this.Warning.log(message);
      return;
    }

    if (metadataResult.code === ProjectErrorCode.BaseromNotValid) {
      this.Info.failure();
      const message = `The template "${flags.name}" is not valid, the baserom is not valid`;
      this.Warning.log(message);
      return;
    }

    const messages = R.messages(metadataResult, { verbose: true });
    this.Error(`Failed to list project template metadata\n${messages}`, 1);
  }
}
