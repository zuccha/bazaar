import { R, ResultVoid } from "../../utils/result";
import Manager from "../manager";
import Resource from "../resource";

const ErrorCode = {
  Generic: "Template.Generic",
};

export default abstract class Template<
  R extends Resource<unknown>,
> extends Manager {
  static ErrorCode = ErrorCode;

  protected abstract resource: R;

  async createFromResource(
    sourceResource: R,
    partialOptions?: Partial<{ force: boolean }>,
  ): Promise<ResultVoid> {
    const scope = this.scope("createFromResource");

    const result = await sourceResource.snapshot(this.resource, partialOptions);
    if (R.isError(result)) {
      const message = `Failed to snapshot from source resource`;
      return R.Stack(result, scope, message, ErrorCode.Generic);
    }

    return R.Void;
  }

  async initResource(
    targetResource: R,
    partialOptions?: Partial<{ force: boolean }>,
  ): Promise<ResultVoid> {
    const scope = this.scope("createResource");

    const result = await this.resource.snapshot(targetResource, partialOptions);
    if (R.isError(result)) {
      const message = `Failed to snapshot into target resource`;
      return R.Stack(result, scope, message, ErrorCode.Generic);
    }

    return R.Void;
  }
}
