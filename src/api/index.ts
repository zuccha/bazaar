import ToolManager from "./managers/tool-manager";
import { FS } from "./utils/fs";

export default class Api {
  readonly tool: ToolManager;

  constructor(fs: FS) {
    this.tool = new ToolManager(fs);
  }
}
