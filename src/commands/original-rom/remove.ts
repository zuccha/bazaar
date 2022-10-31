import { CliUx } from "@oclif/core";
import OriginalRomManager from "../../api/managers/original-rom-manager";
import { R } from "../../api/utils/result";
import BaseCommand from "../../utils/base-command";

export default class OriginalRomRemoveCommand extends BaseCommand<
  typeof OriginalRomRemoveCommand
> {
  static summary = "Remove the copy of the original vanilla ROM of SMW";
  static description = `\
Removing the original ROM from Bazaar will not remove the file used to add it.

Attempting to remove the original ROM if none was added will result in an\
 error.`;

  static examples = ["bazaar original-rom remove"];

  async run(): Promise<void> {
    CliUx.ux.action.start("Removing original ROM...");
    const result = await this.api.originalRom.remove();
    if (R.isOk(result)) {
      CliUx.ux.action.stop();
      return;
    }

    if (result.code === OriginalRomManager.ErrorCode.OriginalRomNotFound) {
      this.Warn("No original ROM was present");
      CliUx.ux.action.stop("interrupted");
      return;
    }

    const messages = R.messages(result, { verbose: true });
    this.Error(`Failed to remove original ROM\n${messages}`, 1);
  }
}
