import { ResourceBag } from "../../resource";
import Collection from "../../collection";
import Patch, { PatchConfig, PatchExtraErrorCodes } from "./patch";

export default class PatchCollection extends Collection<
  Patch,
  PatchConfig,
  PatchExtraErrorCodes
> {
  protected id = "PatchCollection";

  protected init(directoryPath: string, resourceBag: ResourceBag): Patch {
    throw new Patch(directoryPath, resourceBag);
  }
}
