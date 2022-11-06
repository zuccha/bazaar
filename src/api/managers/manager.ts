import { FS } from "../utils/fs";
import { Logger } from "../utils/logger";

export type ManagerBag = {
  fs: FS;
  logger: Logger;
};

export default abstract class Manager<Bag extends ManagerBag = ManagerBag> {
  protected abstract id: string;

  protected bag: Bag;

  constructor(bag: Bag) {
    this.bag = bag;
  }

  protected scope(functionName: string): string {
    return `${this.id}.${functionName}`;
  }

  protected get fs(): FS {
    return this.bag.fs;
  }

  protected get logger(): Logger {
    return this.bag.logger;
  }
}
