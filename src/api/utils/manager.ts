import { FS } from "./fs";

export type ManagerBag = {
  cacheDirectoryPath: string;
  fs: FS;
  log: (message: string) => void;
};

export default abstract class Manager {
  protected abstract directoryName: string;

  protected cacheDirectoryPath: string;
  protected fs: FS;
  protected log: (message: string) => void;

  constructor({ cacheDirectoryPath, fs, log }: ManagerBag) {
    this.cacheDirectoryPath = cacheDirectoryPath;
    this.fs = fs;
    this.log = log;
  }

  protected get path(): string {
    return this.fs.join(this.cacheDirectoryPath, this.directoryName);
  }
}
