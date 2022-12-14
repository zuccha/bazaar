import { ToolErrorCode } from "../../api/managers/tool-collection/tool";
import { R } from "../../api/utils/result";
import {
  getValidateProjectErrorMessage,
  isValidateProjectErrorCode,
  ProjectFlags,
} from "../../commands-utils/project";
import BaseCommand from "../../utils/base-command";

export default class ProjectOpenLunarMagicCommand extends BaseCommand<
  typeof ProjectOpenLunarMagicCommand
> {
  static summary = "Open the ROM in Lunar Magic";
  static description = `\
If Lunar Magic is not installed, this command will fail.

To install Lunar Magic, run \`bazaar tool install lunar-magic\`.`;

  static examples = [
    "bazaar project open-emulator",
    "bazaar project open-emulator --path=C:\\Users\\me\\Documents\\MyProject",
  ];

  static flags = {
    ...ProjectFlags,
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(ProjectOpenLunarMagicCommand);

    this.Info.start(`Opening ROM hack in Lunar Magic`);
    const project = this.api.project(flags.path);
    const result = await project.openLunarMagic();

    if (R.isOk(result)) {
      this.Info.success();
      return;
    }

    if (isValidateProjectErrorCode(result.code)) {
      this.Info.failure();
      this.Warning.log(getValidateProjectErrorMessage(result.code, flags.path));
      return;
    }

    if (result.code === ToolErrorCode.ToolNotUpToDate) {
      this.Info.failure();
      const message = `Lunar Magic is not installed or up-to-date
Check \`bazaar tool install lunar-magic --help\` for more`;
      this.Warning.log(message);
      return;
    }

    this.Info.failure();
    this.Error(result, `Failed to open ROM hack in Lunar Magic`);
  }
}
