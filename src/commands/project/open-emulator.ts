import { EditorErrorCode } from "../../api/managers/editor-collection/editor";
import { R } from "../../api/utils/result";
import {
  getValidateProjectErrorMessage,
  isValidateProjectErrorCode,
  ProjectFlags,
} from "../../commands-utils/project";
import BaseCommand from "../../utils/base-command";

export default class ProjectOpenEmulatorCommand extends BaseCommand<
  typeof ProjectOpenEmulatorCommand
> {
  static summary = "Run the ROM hack in the emulator";
  static description = `\
Run the ROM hack in the configured emulator.

If no emulator is set, this command will fail.

To configure and emulator, check \`bazaar editor emulator set --help\`.`;

  static examples = [
    "bazaar project open-emulator",
    "bazaar project open-emulator --path=C:\\Users\\me\\Documents\\MyProject",
  ];

  static flags = {
    ...ProjectFlags,
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(ProjectOpenEmulatorCommand);

    this.Info.start(`Running ROM hack in emulator`);
    const project = this.api.project(flags.path);
    const result = await project.openEmulator();

    if (R.isOk(result)) {
      this.Info.success();
      return;
    }

    if (isValidateProjectErrorCode(result.code)) {
      this.Info.failure();
      this.Warning.log(getValidateProjectErrorMessage(result.code, flags.path));
      return;
    }

    if (result.code === EditorErrorCode.ExeNotSet) {
      this.Info.failure();
      const message = `The emulator is not configured
Check \`bazaar editor set emulator --help\` for more`;
      this.Warning.log(message);
      return;
    }

    if (result.code === EditorErrorCode.ExeNotFound) {
      this.Info.failure();
      const message = `The configured emulator does not exist
Configure a new one \`bazaar editor set emulator --help\` for more`;
      this.Warning.log(message);
      return;
    }

    if (result.code === EditorErrorCode.ExeNotValid) {
      this.Info.failure();
      const message = `The configured emulator is not a valid executable
Configure a new one \`bazaar editor set emulator --help\` for more`;
      this.Warning.log(message);
      return;
    }

    this.Info.failure();
    this.Error(result, `Failed to run ROM hack in emulator`);
  }
}
