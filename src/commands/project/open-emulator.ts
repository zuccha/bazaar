import Emulator from "../../api/managers/editor-collection/editors/emulator";
import { R } from "../../api/utils/result";
import { ProjectFlags } from "../../commands-utils/project";
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

    if (result.code === Emulator.ErrorCode.ExeNotSet) {
      this.Info.failure();
      const message = `The emulator is not configured
Check \`bazaar editor set emulator --help\` for more`;
      this.Warning.log(message);
      return;
    }

    if (result.code === Emulator.ErrorCode.ExeNotFound) {
      this.Info.failure();
      const message = `The configured emulator does not exist
Configure a new one \`bazaar editor set emulator --help\` for more`;
      this.Warning.log(message);
      return;
    }

    if (result.code === Emulator.ErrorCode.ExeNotValid) {
      this.Info.failure();
      const message = `The configured emulator is not a valid executable
Configure a new one \`bazaar editor set emulator --help\` for more`;
      this.Warning.log(message);
      return;
    }

    this.Info.failure();
    const messages = R.messages(result, { verbose: true });
    this.Error(`Failed to run ROM hack in emulator\n${messages}`, 1);
  }
}
