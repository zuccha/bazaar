import { ConfigurableErrorCode } from "../../../api/managers/configurable";
import { ProjectErrorCode } from "../../../api/managers/project";
import { ResourceErrorCode } from "../../../api/managers/resource";
import { R } from "../../../api/utils/result";
import {
  ProjectConfigFlags,
  ProjectTemplateFlags,
} from "../../../commands-utils/project";
import BaseCommand from "../../../utils/base-command";

export default class TemplateProjectUpdateMetadataCommand extends BaseCommand<
  typeof TemplateProjectUpdateMetadataCommand
> {
  static summary = "Update metadata of a project template";
  static description = "Metadata include the list of authors and the version.";

  static examples = [
    "template bazaar project update-metadata --name=RHR --author=john",
    "bazaar template project update-metadata --name=RHR --author=john --author=jane",
    "bazaar template project update-metadata --name=RHR --version=2.0",
    "bazaar template project update-metadata --name=RHR --author=john --author=jane --version=v3",
  ];

  static flags = {
    ...ProjectTemplateFlags,
    ...ProjectConfigFlags,
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(TemplateProjectUpdateMetadataCommand);

    this.Info.start("Updating metadata");
    const projectTemplate = this.api.templates.project(flags.name);
    const result = await projectTemplate.updateMetadata({
      ...(flags.author ? { authors: flags.author } : {}),
      ...(flags.version ? { version: flags.version } : {}),
    });

    if (R.isOk(result)) {
      this.Info.success();
      return;
    }

    if (result.code === ResourceErrorCode.DirectoryNotFound) {
      this.Info.failure();
      this.Warning.log(`The template "${flags.name}" doesn't exist`);
      return;
    }

    if (result.code === ConfigurableErrorCode.ConfigNotFound) {
      this.Info.failure();
      const message = `The template "${flags.name}" is not valid, no config was found`;
      this.Warning.log(message);
      return;
    }

    if (result.code === ConfigurableErrorCode.ConfigNotValid) {
      this.Info.failure();
      const message = `The template "${flags.name}" is not valid, the config is not valid`;
      this.Warning.log(message);
      return;
    }

    if (result.code === ProjectErrorCode.BaseromNotFound) {
      this.Info.failure();
      const message = `The template "${flags.name}" is not valid, no baserom was found`;
      this.Warning.log(message);
      return;
    }

    if (result.code === ProjectErrorCode.BaseromNotValid) {
      this.Info.failure();
      const message = `The template "${flags.name}" is not valid, the baserom is not valid`;
      this.Warning.log(message);
      return;
    }

    if (result.code === ConfigurableErrorCode.ConfigIsEmpty) {
      this.Info.failure();
      const message = `No parameter was specified, you should specify at least author or version`;
      this.Warning.log(message);
      return;
    }

    this.Info.failure();
    const messages = R.messages(result, { verbose: true });
    this.Error(`Failed to update project template metadata\n${messages}`, 1);
  }
}
