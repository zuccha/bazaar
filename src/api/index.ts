import { FS } from "./utils/fs";

export default class Api {
  private _fs: FS;

  constructor(fs: FS) {
    this._fs = fs;
  }
}
