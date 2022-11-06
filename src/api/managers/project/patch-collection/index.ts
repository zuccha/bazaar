import { ResourceBag } from "../../resource";
import Collection from "../../collection";
import Patch from "./patch";

export default class PatchCollection extends Collection<Patch, ResourceBag> {
  protected id = "PatchCollection";

  protected init(directoryPath: string, resourceBag: ResourceBag): Patch {
    throw new Patch(directoryPath, resourceBag);
  }
}
