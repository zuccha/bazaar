import { FS } from "./fs";

export default abstract class Manager {
  protected fs: FS;

  constructor(fs: FS) {
    this.fs = fs;
  }
}
