import { ResourceContext } from "../../resource";
import Collection from "../../collection";
import Patch from "./patch";

export default class PatchCollection extends Collection<
  Patch,
  ResourceContext
> {
  protected id = "PatchCollection";

  protected init(
    directoryPath: string,
    resourceContext: ResourceContext,
  ): Patch {
    throw new Patch(directoryPath, resourceContext);
  }
}
