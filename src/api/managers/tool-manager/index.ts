import Manager from "../../utils/manager";
import supportedTools from "./supported-tools";
import { ToolInfo } from "./types";

export default class ToolManager extends Manager {
  list(): ToolInfo[] {
    return Object.values(supportedTools).map((tool) => ({
      tool,
      status: "not-installed",
    }));
  }
}
