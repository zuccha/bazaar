import { DirectoryInfo } from "../utils/fs";
import { Result, ResultVoid } from "../utils/result";
import Manager, { ManagerBag } from "./manager";

export default abstract class DirectoryManager extends Manager {
  protected abstract id: string;

  protected directoryPath: string;

  constructor(directoryPath: string, managerBag: ManagerBag) {
    super(managerBag);

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
