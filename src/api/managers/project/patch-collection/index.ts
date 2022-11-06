import { ResourceBag } from "../../resource";
import Collection from "../../collection";
import Patch from "./patch";

export default class PatchCollection extends Collection<Patch> {
  protected id = "PatchCollection";

  protected init(directoryPath: string, resourceBag: ResourceBag): Patch {
    throw new Patch(directoryPath, resourceBag);
  }
}
