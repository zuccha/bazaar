import { R, Result } from "../utils/result";
import Directory, { DirectoryBag } from "./directory";

export type CollectionInfo = {
  name: string;
};

export enum CollectionErrorCode {
  Internal,
}

export type CollectionErrorCodes = {
  List: CollectionErrorCode.Internal;
  Remove: CollectionErrorCode.Internal;
};

export default abstract class Collection<
  Item,
  Bag extends DirectoryBag,
> extends Directory<Bag> {
  protected abstract init(directoryPath: string, bag: Bag): Item;

  get(name: string): Item {
    return this.init(this.path(name), this.bag);
  }

  async list(): Promise<
    Result<CollectionInfo[], CollectionErrorCodes["List"]>
  > {
    const scope = this.scope("list");

    this.logger.start(`Checking if collection directory exists`);
    const exists = await this.exists();
    if (!exists) {
      this.logger.failure();
      return R.Ok([]);
    }
    this.logger.success();

    this.logger.start(`Gathering collection directory info`);
    const directoryInfoResult = await this.getDirectoryInfo();
    if (R.isError(directoryInfoResult)) {
      this.logger.failure();
      const message = `Failed to gather collection directory "${this.path()}" info`;
      return R.Stack(
        directoryInfoResult,
        scope,
        message,
        CollectionErrorCode.Internal,
      );
    }
    this.logger.success();

    const infos = directoryInfoResult.data.directoryNames.map(
      (directoryName) => ({ name: directoryName }),
    );
    return R.Ok(infos);
  }
}
