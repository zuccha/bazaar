import { R, ResultVoid } from "../../../utils/result";
import Tool, { ToolErrorCodes } from "../tool";

export enum LunarMagicErrorCode {
  Internal,
  RomNotFound,
  RomNotValid,
}

export type LunarMagicErrorCodes = {
  Open:
    | ToolErrorCodes["Exec"]
    | LunarMagicErrorCode.Internal
    | LunarMagicErrorCode.RomNotFound
    | LunarMagicErrorCode.RomNotValid;
};

export default class LunarMagic extends Tool {
  protected readonly id = "LunarMagic";

  readonly displayName = "Lunar Magic";
  protected readonly exeName = "Lunar Magic.exe";
  protected readonly downloadUrl = "https://dl.smwcentral.net/32211/lm333.zip";
  protected readonly supportedVersion = "3.33";

  async open(
    romPath: string,
  ): Promise<ResultVoid<LunarMagicErrorCodes["Open"]>> {
    const scope = this.scope("open");

    romPath = this.fs.resolve(romPath);

    this.logger.start(`Checking if ROM "${romPath}" exists`);
    const romExists = await this.fs.exists(romPath);
    if (!romExists) {
      this.logger.failure();
      const message = `ROM "${romPath}" does not exist`;
      return R.Error(scope, message, LunarMagicErrorCode.RomNotFound);
    }
    this.logger.success();

    this.logger.start(`Checking if ROM "${romPath}" is valid`);
    const romIsFile = await this.fs.isFile(romPath);
    if (!romIsFile) {
      this.logger.failure();
      const message = `ROM "${romPath}" does not exist`;
      return R.Error(scope, message, LunarMagicErrorCode.RomNotValid);
    }
    this.logger.success();

    const execResult = await this.exec(romPath);
    if (R.isError(execResult)) {
      return execResult;
    }

    if (execResult.data.stderr) {
      const message = `Failed to run "${romPath}" in emulator`;
      return R.Stack(
        R.Error(scope, execResult.data.stderr, LunarMagicErrorCode.Internal),
        scope,
        message,
        LunarMagicErrorCode.Internal,
      );
    }

    return R.Void;
  }
}
