import { Flags } from "@oclif/core";
import { OriginalRomErrorCode } from "../../api/managers/original-rom";
import { R } from "../../api/utils/result";
import BaseCommand from "../../utils/base-command";

export default class OriginalRomAddCommand extends BaseCommand<
  typeof OriginalRomAddCommand
> {
  static summary = "Set the original vanilla ROM of SMW";
  static description = `\
The original ROM should be an unmodified ".sfc" file of vanilla Super Mario\
 World.

The file provided will be copied and saved in Bazaar's cache. This will ensure\
 no accidental changes will be made to the original file.

The original ROM is used to generate BPS files.

Adding the original ROM a second time will overwrite any version previously\
 added.

The command will fail if an invalid file is provided.`;

  static examples = [
    'bazaar original-rom add --path="~\\smw\\vanilla-smw.sfc"',
  ];

  static flags = {
    path: Flags.string({
      summary: "Path to the copy of the original SMW ROM",
      description: "The file must be a valid, unmodified copy of SMW.",
      required: true,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(OriginalRomAddCommand);

    this.Info.start("Adding original ROM");
    const result = await this.api.originalRom.add(flags.path);
    if (R.isOk(result)) {
      this.Info.success();
      return;
    }

    if (result.code === OriginalRomErrorCode.OriginalRomNotFound) {
      this.Info.failure();
      this.Warning.log("The given file does not exist");
      return;
    }

    if (result.code === OriginalRomErrorCode.OriginalRomNotValid) {
      this.Info.failure();
      this.Warning.log("The given file is not actually a file");
      return;
    }

    this.Info.failure();
    const messages = R.messages(result, { verbose: true });
    this.Error(`Failed to add original ROM\n${messages}`, 1);
  }
}
