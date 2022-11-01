import { R, ResultVoid } from "../../../utils/result";
import Tool from "../tool";

const ErrorCode = {
  ...Tool.ErrorCode,
  FailedToOpenRom: "LunarMagic.FailedToOpenRom",
  RomNotFound: "LunarMagic.RomNotFound",
};

export default class LunarMagic extends Tool {
  static ErrorCode = ErrorCode;

  protected id = "LunarMagic";

  protected displayName = "Lunar Magic";
  protected exeName = "Lunar Magic.exe";
  protected downloadUrl = "https://dl.smwcentral.net/32211/lm333.zip";
  protected supportedVersion = "3.33";

  async open(romPath: string): Promise<ResultVoid> {
    const scope = this.scope("open");

    romPath = this.fs.resolve(romPath);

    this.logger.start(`Checking if ROM "${romPath}" exists`);
    const pathExists = await this.fs.exists(romPath);
    if (!pathExists) {
      this.logger.failure();
      const message = `ROM "${romPath}" does not exist`;
      return R.Error(scope, message, ErrorCode.RomNotFound);
    }
    this.logger.success();

    const execResult = await this.exec(romPath);
    if (R.isError(execResult)) {
      return execResult;
    }

    if (execResult.data.stderr) {
      const message = `Failed to run "${romPath}" in emulator`;
      return R.Stack(
        R.Error(scope, execResult.data.stderr, ErrorCode.Generic),
        scope,
        message,
        ErrorCode.FailedToOpenRom,
      );
    }

    return R.Void;
  }
}
