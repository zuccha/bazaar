import { CliUx, Flags } from "@oclif/core";
import OriginalRomManager from "../../api/managers/original-rom-manager";
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

    CliUx.ux.action.start("Adding original ROM...");
    const result = await this.api.originalRom.add(flags.path);
    if (R.isOk(result)) {
      CliUx.ux.action.stop();
      return;
    }

    if (result.code === OriginalRomManager.ErrorCode.OriginalRomNotFound) {
      this.Warn("The given file does not exist");
      CliUx.ux.action.stop("interrupted");
      return;
    }

    if (result.code === OriginalRomManager.ErrorCode.OriginalRomNotValid) {
      this.Warn("The given file is not actually a file");
      CliUx.ux.action.stop("interrupted");
      return;
    }

    const messages = R.messages(result, { verbose: true });
    this.Error(`Failed to add original ROM\n${messages}`, 1);
  }
}
