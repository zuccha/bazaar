import EditorManager from "./managers/editor-manager";
import ToolManager from "./managers/tool-manager";
import { ManagerBag } from "./utils/manager";

export default class Api {
  readonly editor: EditorManager;
  readonly tool: ToolManager;

  constructor(managerBag: ManagerBag) {
    this.editor = new EditorManager(managerBag);
    this.tool = new ToolManager(managerBag);
  }
}
