import Manager from "../../utils/manager";
import { R, Result, ResultVoid } from "../../utils/result";
import { OriginalRom } from "./original-rom";

export default class OriginalRomManager extends Manager {
  static ErrorCode = {
    OriginalRomNotFound: "OriginalRomManager.OriginalRomNotFound",
    OriginalRomNotValid: "OriginalRomManager.OriginalRomNotValid",
    Generic: "OriginalRomManager.Generic",
  };

  static OriginalRomFileName = "original-rom.sfc";

  protected id = "original-rom";

  async add(sourceOriginalRomPath: string): Promise<ResultVoid> {
    const scope = this.scope("add");

    this.logger.start("Checking if the given original ROM exists");
    const sourceOriginalRomPathExists = await this.fs.exists(
      sourceOriginalRomPath,
    );
    if (!sourceOriginalRomPathExists) {
      this.logger.failure();
      const message = "The given original ROM does not exists";
      return R.Error(
        scope,
        message,
        OriginalRomManager.ErrorCode.OriginalRomNotFound,
      );
    }
    this.logger.success();

    this.logger.start("Checking if the given original ROM is a file");
    const sourceOriginalRomPathIsFile = await this.fs.isFile(
      sourceOriginalRomPath,
    );
    if (!sourceOriginalRomPathIsFile) {
      this.logger.failure();
      const message = "The given original ROM is not a file";
      return R.Error(
        scope,
        message,
        OriginalRomManager.ErrorCode.OriginalRomNotValid,
      );
    }
    this.logger.success();

    this.logger.start("Copying given original ROM");
    const targetOriginalRomPath = this.path(
      OriginalRomManager.OriginalRomFileName,
    );
    const result = await this.fs.copyFile(
      sourceOriginalRomPath,
      targetOriginalRomPath,
    );
    if (R.isError(result)) {
      this.logger.failure();
      const message = "Failed to copy given original ROM";
      return R.Stack(
        result,
        scope,
        message,
        OriginalRomManager.ErrorCode.Generic,
      );
    }
    this.logger.success();

    return R.Void;
  }

  async list(): Promise<Result<OriginalRom>> {
    const originalRomPath = this.path(OriginalRomManager.OriginalRomFileName);

    this.logger.start("Checking if original ROM exists");
    const sourceOriginalRomPathExists = await this.fs.exists(originalRomPath);
    if (!sourceOriginalRomPathExists) {
      this.logger.failure();
      return R.Ok({ filePath: undefined });
    }

    this.logger.success();
    return R.Ok({ filePath: originalRomPath });
  }

  async remove(): Promise<ResultVoid> {
    const scope = this.scope("remove");

    const originalRomPath = this.path(OriginalRomManager.OriginalRomFileName);

    this.logger.start("Checking if original ROM exists");
    const sourceOriginalRomPathExists = await this.fs.exists(originalRomPath);
    if (!sourceOriginalRomPathExists) {
      this.logger.failure();
      const message = "The given original ROM does not exists";
      return R.Error(
        scope,
        message,
        OriginalRomManager.ErrorCode.OriginalRomNotFound,
      );
    }
    this.logger.success();

    this.logger.start("Removing original ROM");
    const result = await this.fs.removeFile(originalRomPath);
    if (R.isError(result)) {
      this.logger.failure();
      const message = "Failed to remove original ROM";
      return R.Stack(
        result,
        scope,
        message,
        OriginalRomManager.ErrorCode.Generic,
      );
    }
    this.logger.success();

    return R.Void;
  }
}
