import EditorCollection from "../managers/editor-collection";
import ToolCollection from "../managers/tool-collection";
import ConfigManager from "./config-manager";
import { ManagerBag } from "./directory-manager";

export type ResourceBag = {
  editors: EditorCollection;
  tools: ToolCollection;
};

export default abstract class Resource<Config> extends ConfigManager<Config> {
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
