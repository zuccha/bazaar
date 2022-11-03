import { ResultVoid } from "../utils/result";
import Configurable from "./configurable";
import EditorCollection from "./editor-collection";
import { ManagerBag } from "./manager";
import OriginalRom from "./original-rom";
import ToolCollection from "./tool-collection";

export type ResourceBag = {
  originalRom: OriginalRom;
  editors: EditorCollection;
  tools: ToolCollection;
};

export default abstract class Resource<Config> extends Configurable<Config> {
  protected resourceBag: ResourceBag;

  constructor(
    directoryPath: string,
    managerBag: ManagerBag,
    resourceBag: ResourceBag,
  ) {
    super(directoryPath, managerBag);

    this.resourceBag = resourceBag;
  }

  protected get originalRom(): OriginalRom {
    return this.resourceBag.originalRom;
  }

  protected get editors(): EditorCollection {
    return this.resourceBag.editors;
  }

  protected get tools(): ToolCollection {
    return this.resourceBag.tools;
  }

  abstract validate(): Promise<ResultVoid>;

  abstract snapshot(
    targetResource: unknown,
    config?: Partial<Config>,
    partialOptions?: Partial<{ force: boolean; config: Partial<Config> }>,
  ): Promise<ResultVoid>;
}
