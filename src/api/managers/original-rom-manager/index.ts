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

    this.log("Checking if the given original ROM exists...");
    const sourceOriginalRomPathExists = await this.fs.exists(
      sourceOriginalRomPath,
    );
    if (!sourceOriginalRomPathExists) {
      const message = "The given original ROM does not exists";
      return R.Error(
        scope,
        message,
        OriginalRomManager.ErrorCode.OriginalRomNotFound,
      );
    }
    this.log("The given original ROM exists");

    this.log("Checking if the given original ROM is a file...");
    const sourceOriginalRomPathIsFile = await this.fs.isFile(
      sourceOriginalRomPath,
    );
    if (!sourceOriginalRomPathIsFile) {
      const message = "The given original ROM is not a file";
      return R.Error(
        scope,
        message,
        OriginalRomManager.ErrorCode.OriginalRomNotValid,
      );
    }
    this.log("The given original ROM is a file");

    this.log("Copying given original ROM...");
    const targetOriginalRomPath = this.path(
      OriginalRomManager.OriginalRomFileName,
    );
    const result = await this.fs.copyFile(
      sourceOriginalRomPath,
      targetOriginalRomPath,
    );
    if (R.isError(result)) {
      const message = "Failed to copy given original ROM";
      return R.Stack(
        result,
        scope,
        message,
        OriginalRomManager.ErrorCode.Generic,
      );
    }
    this.log("Given original ROM copied");

    return R.Void;
  }

  async list(): Promise<Result<OriginalRom>> {
    const originalRomPath = this.path(OriginalRomManager.OriginalRomFileName);

    this.log("Checking if original ROM exists...");
    const sourceOriginalRomPathExists = await this.fs.exists(originalRomPath);
    if (!sourceOriginalRomPathExists) {
      this.log("Original ROM does not exist");
      return R.Ok({ filePath: undefined });
    }

    this.log("Original ROM exists");
    return R.Ok({ filePath: originalRomPath });
  }

  async remove(): Promise<ResultVoid> {
    const scope = this.scope("remove");

    const originalRomPath = this.path(OriginalRomManager.OriginalRomFileName);

    this.log("Checking if original ROM exists...");
    const sourceOriginalRomPathExists = await this.fs.exists(originalRomPath);
    if (!sourceOriginalRomPathExists) {
      const message = "The given original ROM does not exists";
      return R.Error(
        scope,
        message,
        OriginalRomManager.ErrorCode.OriginalRomNotFound,
      );
    }
    this.log("Original ROM exists");

    this.log("Removing original ROM...");
    const result = await this.fs.removeFile(originalRomPath);
    if (R.isError(result)) {
      const message = "Failed to remove original ROM";
      return R.Stack(
        result,
        scope,
        message,
        OriginalRomManager.ErrorCode.Generic,
      );
    }
    this.log("original ROM removed");

    return R.Void;
  }
}
