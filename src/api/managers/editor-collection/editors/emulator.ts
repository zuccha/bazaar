import { R, ResultVoid } from "../../../utils/result";
import Editor from "../editor";

const ErrorCode = {
  ...Editor.ErrorCode,
  FailedToOpenRom: "ErrorCode.FailedToOpenRom",
  RomNotFound: "ErrorCode.RomNotFound",
};

export default class Emulator extends Editor {
  static ErrorCode = ErrorCode;

  protected id = "Emulator";

  protected configName = "_emulator.json";
  displayName = "Emulator";

  async open(romPath: string): Promise<ResultVoid> {
    const scope = this.scope("open");

    romPath = this.fs.resolve(romPath);

    this.logger.start(`Checking if ROM exists`);
    const pathExists = await this.fs.exists(romPath);
    if (!pathExists) {
      this.logger.failure();
      const message = `ROM "${romPath}" does not exist`;
      return R.Error(scope, message, ErrorCode.RomNotFound);
    }
    this.logger.success();

    this.logger.start(`Executing emulator command`);
    const execResult = await this.exec(romPath);
    if (R.isError(execResult)) {
      this.logger.failure();
      return execResult;
    }
    this.logger.success();

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
