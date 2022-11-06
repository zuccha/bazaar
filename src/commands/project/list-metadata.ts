import { R } from "../../api/utils/result";
import {
  getValidateProjectErrorMessage,
  isValidateProjectErrorCode,
  ProjectFlags,
} from "../../commands-utils/project";
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

    this.Verbose.start("Gathering project metadata");
    const project = this.api.project(flags.path);
    const metadataResult = await project.getMetadata();

    if (R.isOk(metadataResult)) {
      this.Verbose.success();
      const { authors, version } = metadataResult.data;
      this.log(`Authors: ${authors.length > 0 ? authors.join(", ") : "-"}`);
      this.log(`Version: ${version || "-"}`);
      return;
    }

    this.Verbose.failure();

    if (isValidateProjectErrorCode(metadataResult.code)) {
      this.Warning.log(
        getValidateProjectErrorMessage(metadataResult.code, flags.path),
      );
      return;
    }

    const messages = R.messages(metadataResult, { verbose: true });
    this.Error(`Failed to list project metadata\n${messages}`, 1);
  }
}
