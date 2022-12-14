import { R } from "../../api/utils/result";
import BaseCommand from "../../utils/base-command";
import TextEffect from "../../utils/text-effect";

export default class OriginalRomListCommand extends BaseCommand<
  typeof OriginalRomListCommand
> {
  static summary = "Show the path to the original ROM";
  static description = `\
The original ROM should be an unmodified ".sfc" file of vanilla Super Mario\
 World.

The original ROM is used to generate BPS files.`;

  static examples = ["bazaar original-rom list"];

  async run(): Promise<void> {
    this.Verbose.start("Gathering original ROM info");
    const originalRomInfoResult = await this.api.originalRom.list();
    if (R.isError(originalRomInfoResult)) {
      this.Verbose.failure();
      this.Error(originalRomInfoResult, `Failed to get original ROM`);
      return;
    }
    this.Verbose.success();
    this.log(originalRomInfoResult.data.filePath ?? TextEffect.i("<not set>"));
  }
}
