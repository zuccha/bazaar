import { ConfigurableErrorCode } from "../../api/managers/configurable";
import { ProjectErrorCode } from "../../api/managers/project";
import { ResourceErrorCode } from "../../api/managers/resource";
import { R } from "../../api/utils/result";
import { ProjectFlags } from "../../commands-utils/project";
import BaseCommand from "../../utils/base-command";

export default class ProjectListMetadataCommand extends BaseCommand<
  typeof ProjectListMetadataCommand
> {
  static summary = "List metadata of the current project";
  static description = "Metadata include the list of authors and the version.";

  static examples = [
    "bazaar project list-metadata",
    "bazaar project list-metadata --path=./projects/MyProject",
  ];

  static flags = ProjectFlags;

  async run(): Promise<void> {
    const { flags } = await this.parse(ProjectListMetadataCommand);

    const project = this.api.project(flags.path);
    const metadataResult = await project.getMetadata();

    if (R.isOk(metadataResult)) {
      this.Info.success();
      return;
    }

    if (metadataResult.code === ResourceErrorCode.DirectoryNotFound) {
      this.Info.failure();
      this.Warning.log(`The project "${flags.path}" does not exist`);
      return;
    }

    if (metadataResult.code === ConfigurableErrorCode.ConfigNotFound) {
      this.Info.failure();
      const message = `The project "${flags.path}" is not valid, no config was found`;
      this.Warning.log(message);
      return;
    }

    if (metadataResult.code === ConfigurableErrorCode.ConfigNotValid) {
      this.Info.failure();
      const message = `The project "${flags.path}" is not valid, the config is not valid`;
      this.Warning.log(message);
      return;
    }

    if (metadataResult.code === ProjectErrorCode.BaseromNotFound) {
      this.Info.failure();
      const message = `The project "${flags.path}" is not valid, no baserom was found`;
      this.Warning.log(message);
      return;
    }

    if (metadataResult.code === ProjectErrorCode.BaseromNotValid) {
      this.Info.failure();
      const message = `The project "${flags.path}" is not valid, the baserom is not valid`;
      this.Warning.log(message);
      return;
    }

    const messages = R.messages(metadataResult, { verbose: true });
    this.Error(`Failed to list project metadata\n${messages}`, 1);
  }
}
