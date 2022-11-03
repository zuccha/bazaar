import { R, ResultVoid } from "../../utils/result";
import Manager from "../manager";
import Resource from "../resource";

export default abstract class Template<
  C extends Record<string | number | symbol, unknown>,
  R extends Resource<C>,
> extends Manager {
  protected abstract resource: R;

  async createFromResource(
    sourceResource: R,
    partialOptions?: Partial<{ force: boolean }>,
  ): Promise<ResultVoid> {
    this.logger.start("Taking snapshot of source project into template");
    const result = await sourceResource.snapshot(
      this.resource,
      undefined,
      partialOptions,
    );
    if (R.isError(result)) {
      this.logger.failure();
      return result;
    }

    this.logger.success();
    return R.Void;
  }

  async initResource(
    targetResource: R,
    config?: Partial<C>,
    partialOptions?: Partial<{ force: boolean }>,
  ): Promise<ResultVoid> {
    this.logger.start("Taking snapshot of template into project");
    const result = await this.resource.snapshot(
      targetResource,
      config,
      partialOptions,
    );
    if (R.isError(result)) {
      this.logger.failure();
      return result;
    }

    this.logger.success();
    return R.Void;
  }
}
