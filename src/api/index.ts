import EditorManager from "./managers/editor-manager";
import OriginalRomManager from "./managers/original-rom-manager";
import ToolManager from "./managers/tool-manager";
import { ManagerBag } from "./utils/manager";

export default class Api {
  readonly editor: EditorManager;
  readonly originalRom: OriginalRomManager;
  readonly tool: ToolManager;

  constructor(managerBag: ManagerBag) {
    this.editor = new EditorManager(managerBag);
    this.originalRom = new OriginalRomManager(managerBag);
    this.tool = new ToolManager(managerBag);
  }
}
