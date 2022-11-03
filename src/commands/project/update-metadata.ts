import Project from "../../api/managers/project";
import { R } from "../../api/utils/result";
import { ProjectConfigFlags, ProjectFlags } from "../../commands-utils/project";
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

    if (result.code === Project.ErrorCode.ProjectNotFound) {
      this.Info.failure();
      this.Warning.log(`The project "${flags.path}" does not exist`);
      return;
    }

    if (result.code === Project.ErrorCode.ProjectNotValid) {
      this.Info.failure();
      const message = `The project "${flags.path}" is not valid (missing baserom, invalid config, etc.)`;
      this.Warning.log(message);
      return;
    }

    if (result.code === Project.ErrorCode.ConfigIsEmpty) {
      this.Info.failure();
      const message = `No parameter was specified, you should specify at least author or version`;
      this.Warning.log(message);
      return;
    }

    this.Info.failure();
    const messages = R.messages(result, { verbose: true });
    this.Error(`Failed to update project metadata\n${messages}`, 1);
  }
}
