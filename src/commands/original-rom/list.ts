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
    const originalRomResult = await this.api.originalRom.list();
    if (R.isError(originalRomResult)) {
      const messages = R.messages(originalRomResult, { verbose: true });
      this.Error(`Failed to get original ROM\n${messages}`, 1);
      return;
    }

    this.log(originalRomResult.data.filePath ?? TextEffect.i("<not set>"));
  }
}
