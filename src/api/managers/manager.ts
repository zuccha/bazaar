import { FS } from "../utils/fs";
import { Logger } from "../utils/logger";

export type ManagerContext = {
  fs: FS;
  logger: Logger;
};

export default abstract class Manager<
  Context extends ManagerContext = ManagerContext,
> {
  protected abstract id: string;

  protected context: Context;

  constructor(context: Context) {
    this.context = context;
  }

  protected scope(functionName: string): string {
    return `${this.id}.${functionName}`;
  }

  protected get fs(): FS {
    return this.context.fs;
  }

  protected get logger(): Logger {
    return this.context.logger;
  }
}
