import { ConfigurableErrorCode } from "../../api/managers/configurable";
import { R } from "../../api/utils/result";
import {
  getValidateProjectErrorMessage,
  isValidateProjectErrorCode,
  ProjectConfigFlags,
  ProjectFlags,
} from "../../commands-utils/project";
import BaseCommand from "../../utils/base-command";

export default class ProjectUpdateMetadataCommand extends BaseCommand<
  typeof ProjectUpdateMetadataCommand
> {
  static summary = "Update metadata of the current project";
  static description = "Metadata include the list of authors and the version.";

  static examples = [
    "bazaar project update-metadata --author=john",
    "bazaar project update-metadata --author=john --author=jane",
    "bazaar project update-metadata --version=2.0",
    "bazaar project update-metadata --author=john --author=jane --version=v3",
  ];

  static flags = {
    ...ProjectFlags,
    ...ProjectConfigFlags,
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(ProjectUpdateMetadataCommand);

    this.Info.start("Updating metadata");
    const project = this.api.project(flags.path);
    const result = await project.updateMetadata({
      ...(flags.author ? { authors: flags.author } : {}),
      ...(flags.version ? { version: flags.version } : {}),
    });

    if (R.isOk(result)) {
      this.Info.success();
      return;
    }

    if (isValidateProjectErrorCode(result.code)) {
      this.Info.failure();
      this.Warning.log(getValidateProjectErrorMessage(result.code, flags.path));
      return;
    }

    if (result.code === ConfigurableErrorCode.ConfigIsEmpty) {
      this.Info.failure();
      const message = `You must provide at least one property to modify`;
      this.Warning.log(message);
      return;
    }

    this.Info.failure();
    const messages = R.messages(result, { verbose: true });
    this.Error(`Failed to update project metadata\n${messages}`, 1);
  }
}
