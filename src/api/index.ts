import ToolManager from "./managers/tool-manager";
import { ManagerBag } from "./utils/manager";

export default class Api {
  readonly tool: ToolManager;

  constructor(managerBag: ManagerBag) {
    this.tool = new ToolManager(managerBag);
  }
}
