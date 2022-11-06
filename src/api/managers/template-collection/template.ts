import { R, ResultVoid } from "../../utils/result";
import Manager from "../manager";
import Resource, {
  ResourceConfig,
  ResourceErrorCodes,
  ResourceExtraErrorCode,
} from "../resource";

export type TemplateErrorCodes = {
  CreateFromResource: ResourceErrorCodes["Snapshot"];
  InitResource: ResourceErrorCodes["Snapshot"];
};

export default abstract class Template<
  C extends ResourceConfig,
  E extends ResourceExtraErrorCode,
  R extends Resource<C, E>,
> extends Manager {
  protected abstract resource: R;

  async createFromResource(
    sourceResource: R,
    partialOptions?: Partial<{ force: boolean }>,
  ): Promise<
    ResultVoid<
      TemplateErrorCodes["CreateFromResource"] | E["Snapshot"] | E["Validate"]
    >
  > {
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
  ): Promise<
    ResultVoid<
      TemplateErrorCodes["InitResource"] | E["Snapshot"] | E["Validate"]
    >
  > {
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
