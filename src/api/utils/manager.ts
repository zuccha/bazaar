import { FS } from "./fs";

export default abstract class Manager {
  protected fs: FS;
  protected cacheDirectoryPath: string;
  protected abstract directoryName: string;

  constructor(fs: FS, cacheDirectoryPath: string) {
    this.fs = fs;
    this.cacheDirectoryPath = cacheDirectoryPath;
  }

  protected get path(): string {
    return this.fs.join(this.cacheDirectoryPath, this.directoryName);
  }
}
