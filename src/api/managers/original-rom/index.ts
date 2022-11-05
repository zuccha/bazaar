import { R, Result, ResultVoid } from "../../utils/result";
import Directory from "../directory";

export type OriginalRomInfo = {
  filePath: string | undefined;
};

export enum OriginalRomErrorCode {
  Internal,
  OriginalRomNotFound,
  OriginalRomNotValid,
}

export default class OriginalRom extends Directory {
  static OriginalRomFileName = "original-rom.sfc";

  protected id = "OriginalRom";

  async add(
    sourceOriginalRomPath: string,
  ): Promise<
    ResultVoid<
      | OriginalRomErrorCode.Internal
      | OriginalRomErrorCode.OriginalRomNotFound
      | OriginalRomErrorCode.OriginalRomNotValid
    >
  > {
    const scope = this.scope("add");

    this.logger.start("Checking if the original ROM exists");
    const sourceOriginalRomPathExists = await this.fs.exists(
      sourceOriginalRomPath,
    );
    if (!sourceOriginalRomPathExists) {
      this.logger.failure();
      const message = `The original ROM "${sourceOriginalRomPath}" does not exists`;
      return R.Error(scope, message, OriginalRomErrorCode.OriginalRomNotFound);
    }
    this.logger.success();

    this.logger.start("Checking if the original ROM is a file");
    const sourceOriginalRomPathIsFile = await this.fs.isFile(
      sourceOriginalRomPath,
    );
    if (!sourceOriginalRomPathIsFile) {
      this.logger.failure();
      const message = `The original ROM "${sourceOriginalRomPath}" is not a file`;
      return R.Error(scope, message, OriginalRomErrorCode.OriginalRomNotValid);
    }
    this.logger.success();

    this.logger.start("Copying original ROM");
    const targetOriginalRomPath = this.path(OriginalRom.OriginalRomFileName);
    const result = await this.fs.copyFile(
      sourceOriginalRomPath,
      targetOriginalRomPath,
    );
    if (R.isError(result)) {
      this.logger.failure();
      const message = `Failed to copy original ROM "${sourceOriginalRomPath}"`;
      return R.Stack(result, scope, message, OriginalRomErrorCode.Internal);
    }
    this.logger.success();

    return R.Void;
  }

  async list(): Promise<Result<OriginalRomInfo, never>> {
    const originalRomPath = this.path(OriginalRom.OriginalRomFileName);

    this.logger.start("Checking if original ROM exists");
    const sourceOriginalRomPathExists = await this.fs.exists(originalRomPath);
    if (!sourceOriginalRomPathExists) {
      this.logger.failure();
      return R.Ok({ filePath: undefined });
    }

    this.logger.success();
    return R.Ok({ filePath: originalRomPath });
  }

  async remove(): Promise<
    ResultVoid<
      OriginalRomErrorCode.Internal | OriginalRomErrorCode.OriginalRomNotFound
    >
  > {
    const scope = this.scope("remove");

    const originalRomPath = this.path(OriginalRom.OriginalRomFileName);

    this.logger.start("Checking if original ROM exists");
    const originalRomPathExists = await this.fs.exists(originalRomPath);
    if (!originalRomPathExists) {
      this.logger.failure();
      const message = `The original ROM "${originalRomPath}" does not exists`;
      return R.Error(scope, message, OriginalRomErrorCode.OriginalRomNotFound);
    }
    this.logger.success();

    this.logger.start("Removing original ROM");
    const result = await this.fs.removeFile(originalRomPath);
    if (R.isError(result)) {
      this.logger.failure();
      const message = `Failed to remove original ROM "${originalRomPath}"`;
      return R.Stack(result, scope, message, OriginalRomErrorCode.Internal);
    }
    this.logger.success();

    return R.Void;
  }
}
