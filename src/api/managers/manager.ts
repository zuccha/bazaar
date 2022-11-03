import { FS } from "../utils/fs";
import { Logger } from "../utils/logger";

export type ManagerBag = {
  fs: FS;
  logger: Logger;
};

export default abstract class Manager {
  protected abstract id: string;

  protected managerBag: ManagerBag;

  constructor(managerBag: ManagerBag) {
    this.managerBag = managerBag;
  }

  protected scope(functionName: string): string {
    return `${this.id}.${functionName}`;
  }

  protected get fs(): FS {
    return this.managerBag.fs;
  }

  protected get logger(): Logger {
    return this.managerBag.logger;
  }
}
