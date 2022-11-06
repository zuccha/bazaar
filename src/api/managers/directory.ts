import {
  CreateDirectory,
  DirectoryInfo,
  GetDirectoryInfo,
  RemoveDirectory,
} from "../utils/fs";
import { Result, ResultVoid } from "../utils/result";
import Manager, { ManagerContext } from "./manager";

export type DirectoryContext = ManagerContext;

export type DirectoryErrorCodes = {
  GetDirectoryInfo: GetDirectoryInfo.ErrorCode;
  CreateDirectory: CreateDirectory.ErrorCode;
  RemoveDirectory: RemoveDirectory.ErrorCode;
};

export default abstract class Directory<
  Context extends DirectoryContext = DirectoryContext,
> extends Manager<Context> {
  protected abstract id: string;

  protected directoryPath: string;

  constructor(directoryPath: string, context: Context) {
    super(context);
    this.directoryPath = directoryPath;
  }

  protected get name(): string {
    return this.fs.getName(this.directoryPath);
  }

  protected path(...paths: string[]): string {
    return this.fs.join(this.directoryPath, ...paths);
  }

  protected async exists(): Promise<boolean> {
    return this.fs.exists(this.directoryPath);
  }

  protected async getDirectoryInfo(): Promise<
    Result<DirectoryInfo, DirectoryErrorCodes["GetDirectoryInfo"]>
  > {
    return this.fs.getDirectoryInfo(this.directoryPath);
  }

  protected async createDirectory(): Promise<
    ResultVoid<DirectoryErrorCodes["CreateDirectory"]>
  > {
    return this.fs.createDirectory(this.directoryPath);
  }

  protected async removeDirectory(): Promise<
    ResultVoid<DirectoryErrorCodes["RemoveDirectory"]>
  > {
    return this.fs.removeDirectory(this.directoryPath);
  }
}
