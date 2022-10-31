import { FS } from "./fs";
import { ResultVoid } from "./result";

export type ManagerBag = {
  fs: FS;
  log: (message: string) => void;
};

export default abstract class Manager {
  protected abstract id: string;

  protected directoryPath: string;
  protected fs: FS;
  protected log: (message: string) => void;

  constructor(directoryPath: string, { fs, log }: ManagerBag) {
    this.directoryPath = directoryPath;
    this.fs = fs;
    this.log = log;
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

  protected async createDirectory(): Promise<ResultVoid> {
    return this.fs.createDirectory(this.directoryPath);
  }

  protected async removeDirectory(): Promise<ResultVoid> {
    return this.fs.removeDirectory(this.directoryPath);
  }
}
