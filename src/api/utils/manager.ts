import { FS } from "./fs";

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

  protected path(...paths: string[]): string {
    return this.fs.join(this.directoryPath, ...paths);
  }

  protected scope(functionName: string): string {
    return `${this.id}.${functionName}`;
  }
}
