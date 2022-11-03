import { ResultVoid } from "../utils/result";
import Configurable, { ConfigurableBag } from "./configurable";
import EditorCollection from "./editor-collection";
import OriginalRom from "./original-rom";
import ToolCollection from "./tool-collection";

export type ResourceBag = {
  originalRom: OriginalRom;
  editors: EditorCollection;
  tools: ToolCollection;
} & ConfigurableBag;

export default abstract class Resource<
  Config extends Record<string | number | symbol, unknown>,
> extends Configurable<Config> {
  protected bag: ResourceBag;

  constructor(directoryPath: string, bag: ResourceBag) {
    super(directoryPath, bag);
    this.bag = bag;
  }

  protected get originalRom(): OriginalRom {
    return this.bag.originalRom;
  }

  protected get editors(): EditorCollection {
    return this.bag.editors;
  }

  protected get tools(): ToolCollection {
    return this.bag.tools;
  }

  abstract validate(): Promise<ResultVoid>;

  abstract snapshot(
    targetResource: unknown,
    config?: Partial<Config>,
    partialOptions?: Partial<{ force: boolean; config: Partial<Config> }>,
  ): Promise<ResultVoid>;
}
