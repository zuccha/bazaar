import { R } from "../../api/utils/result";
import {
  getExecuteCodeEditorErrorMessage,
  isExecuteCodeEditorErrorCode,
} from "../../commands-utils/editor";
import {
  getValidateProjectErrorMessage,
  isValidateProjectErrorCode,
  ProjectFlags,
} from "../../commands-utils/project";
import BaseCommand from "../../utils/base-command";

export default class ProjectOpenCodeEditorCommand extends BaseCommand<
  typeof ProjectOpenCodeEditorCommand
> {
  static summary = "Open the project in the code editor";
  static description = `\
Open the root directory in the code editor.

If no code editor is set, this command will fail.

To configure and code-editor, check \`bazaar editor code-editor set --help\`.`;

  static examples = [
    "bazaar project open-code-editor",
    "bazaar project open-code-editor --path=C:\\Users\\me\\Documents\\MyProject",
  ];

  static flags = {
    ...ProjectFlags,
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(ProjectOpenCodeEditorCommand);

    this.Info.start(`Opening project in code editor`);
    const project = this.api.project(flags.path);
    const result = await project.openCodeEditor();

    if (R.isOk(result)) {
      this.Info.success();
      return;
    }

    if (isValidateProjectErrorCode(result.code)) {
      this.Info.failure();
      this.Warning.log(getValidateProjectErrorMessage(result.code, flags.path));
      return;
    }

    if (isExecuteCodeEditorErrorCode(result.code)) {
      this.Info.failure();
      this.Warning.log(
        getExecuteCodeEditorErrorMessage(result.code, flags.path),
      );
      return;
    }

    this.Info.failure();
    this.Error(result, `Failed to open project in code editor`);
  }
}
