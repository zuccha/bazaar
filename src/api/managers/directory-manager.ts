import { DirectoryInfo, FS } from "../utils/fs";
import { Logger } from "../utils/logger";
import { Result, ResultVoid } from "../utils/result";

export type ManagerBag = {
  fs: FS;
  logger: Logger;
};

export default abstract class DirectoryManager {
  protected abstract id: string;

  protected directoryPath: string;
  protected fs: FS;
  protected logger: Logger;

  constructor(directoryPath: string, { fs, logger }: ManagerBag) {
    this.directoryPath = directoryPath;
    this.fs = fs;
    this.logger = logger;
  }

  protected get name(): string {
    return this.fs.getName(this.directoryPath);
  }

  protected path(...paths: string[]): string {
    return this.fs.join(this.directoryPath, ...paths);
  }

  protected scope(functionName: string): string {
    return `${this.id}.${functionName}`;
  }

  protected async exists(): Promise<boolean> {
    return this.fs.exists(this.directoryPath);
  }

  protected async getDirectoryInfo(): Promise<Result<DirectoryInfo>> {
    return this.fs.getDirectoryInfo(this.directoryPath);
  }

  protected async createDirectory(): Promise<ResultVoid> {
    return this.fs.createDirectory(this.directoryPath);
  }

  protected async removeDirectory(): Promise<ResultVoid> {
    return this.fs.removeDirectory(this.directoryPath);
  }
}
