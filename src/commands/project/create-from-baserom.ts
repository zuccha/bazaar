import { Flags } from "@oclif/core";
import ProjectManager from "../../api/managers/project-manager";
import { R } from "../../api/utils/result";
import BaseCommand from "../../utils/base-command";

export default class ProjectCreateFromBaseromCommand extends BaseCommand<
  typeof ProjectCreateFromBaseromCommand
> {
  static summary = "Create a new project starting from a baserom";
  static description = `\
The project will contain only the baserom (no patches, blocks, etc.).

The new project will be created in a new directory named after the project, in\
 the current directory.`;

  static examples = [
    "bazaar project create-from-baserom --name=test-hack --baserom=~\\vanilla-smw.smc",
    "bazaar project create-from-baserom --name=test-hack --baserom=~\\vanilla-smw.smc --path=..",
    "bazaar project create-from-baserom --name=test-hack --baserom=~\\vanilla-smw.smc --author=zuccha --author=john.doe",
    "bazaar project create-from-baserom --name=test-hack --baserom=~\\vanilla-smw.smc --author=zuccha --version=0.1.0",
  ];

  static flags = {
    baserom: Flags.string({
      summary: "Path to the baserom",
      description:
        "The baserom must be a working smc ROM. This must be a valid path.",
      required: true,
    }),
    name: Flags.string({
      summary: "Name of the project",
      description:
        "The name will be used to create a directory inside the chosen <path>.",
      required: true,
    }),
    author: Flags.string({
      summary: "Author of the hack",
      description: "You can specify authors several times.",
      multiple: true,
      required: false,
    }),
    version: Flags.string({
      summary: "Initial version of the project",
      description: "There is no restriction on what the version can be.",
      required: false,
    }),
    path: Flags.string({
      summary: "Directory where the project will be created",
      description: 'The project folder will be "<path>\\<name>".',
      default: ".",
      required: false,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(ProjectCreateFromBaseromCommand);

    this.LogStart(`Creating project ${flags.name}`);
    const project = this.api.project(flags.name, flags.path);
    const result = await project.createFromBaserom({
      baseromPath: flags.baserom,
      authors: flags.author,
      version: flags.version,
    });

    if (R.isOk(result)) {
      this.LogSuccess();
      return;
    }

    if (result.code === ProjectManager.ErrorCode.BaseromFileNotFound) {
      this.LogFailure();
      this.Warn("The given baserom was not found");
      return;
    }

    if (result.code === ProjectManager.ErrorCode.BaseromNotFile) {
      this.LogFailure();
      this.Warn("The given baserom is not a valid file");
      return;
    }

    if (result.code === ProjectManager.ErrorCode.ProjectExists) {
      this.LogFailure();
      this.Warn("A project with the chosen name already exists");
      return;
    }

    this.LogFailure();
    const messages = R.messages(result, { verbose: true });
    this.Error(`Failed to create project\n${messages}`, 1);
  }
}
