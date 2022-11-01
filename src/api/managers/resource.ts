import Configurable from "./configurable";
import { ManagerBag } from "./directory-manager";
import EditorCollection from "./editor-collection";
import ToolCollection from "./tool-collection";

export type ResourceBag = {
  editors: EditorCollection;
  tools: ToolCollection;
};

export default abstract class Resource<Config> extends Configurable<Config> {
  protected editors: EditorCollection;
  protected tools: ToolCollection;

  constructor(
    directoryPath: string,
    managerBag: ManagerBag,
    resourceBag: ResourceBag,
  ) {
    super(directoryPath, managerBag);

    this.editors = resourceBag.editors;
    this.tools = resourceBag.tools;
  }
}
