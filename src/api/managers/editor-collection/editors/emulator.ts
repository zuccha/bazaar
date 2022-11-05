import { R, ResultVoid } from "../../../utils/result";
import Editor, { EditorErrorCodes } from "../editor";

export enum EmulatorErrorCode {
  Internal,
  RomNotFound,
  RomNotValid,
}

export type EmulatorErrorCodes = {
  Open:
    | EditorErrorCodes["Exec"]
    | EmulatorErrorCode.Internal
    | EmulatorErrorCode.RomNotFound
    | EmulatorErrorCode.RomNotValid;
};

export default class Emulator extends Editor {
  protected id = "Emulator";

  protected configName = "_emulator.json";
  displayName = "Emulator";

  async open(romPath: string): Promise<ResultVoid<EmulatorErrorCodes["Open"]>> {
    const scope = this.scope("open");

    romPath = this.fs.resolve(romPath);

    this.logger.start(`Checking if ROM exists`);
    const romExists = await this.fs.exists(romPath);
    if (!romExists) {
      this.logger.failure();
      const message = `ROM "${romPath}" does not exist`;
      return R.Error(scope, message, EmulatorErrorCode.RomNotFound);
    }
    this.logger.success();

    this.logger.start(`Checking if ROM is valid`);
    const romIsFile = await this.fs.exists(romPath);
    if (!romIsFile) {
      this.logger.failure();
      const message = `ROM "${romPath}" is not valid`;
      return R.Error(scope, message, EmulatorErrorCode.RomNotValid);
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
        R.Error(scope, execResult.data.stderr, EmulatorErrorCode.Internal),
        scope,
        message,
        EmulatorErrorCode.Internal,
      );
    }

    return R.Void;
  }
}
