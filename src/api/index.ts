import EditorCollection from "./managers/editor-collection";
import OriginalRom from "./managers/original-rom";
import Project from "./managers/project";
import ToolCollection from "./managers/tool-collection";
import { FS } from "./utils/fs";
import { Logger } from "./utils/logger";

export default class Api {
  readonly fs: FS;
  readonly logger: Logger;

  readonly editors: EditorCollection;
  readonly originalRom: OriginalRom;
  readonly tools: ToolCollection;

  constructor({
    cacheDirectoryPath,
    fs,
    logger,
  }: {
    cacheDirectoryPath: string;
    fs: FS;
    logger: Logger;
  }) {
    const managerBag = { fs, logger };

    this.fs = fs;
    this.logger = logger;

    this.editors = new EditorCollection(
      fs.join(cacheDirectoryPath, "Editors"),
      managerBag,
    );

    this.originalRom = new OriginalRom(
      fs.join(cacheDirectoryPath, "OriginalROM"),
      managerBag,
    );

    this.tools = new ToolCollection(
      fs.join(cacheDirectoryPath, "Tools"),
      managerBag,
    );
  }

  project(name: string, path: string): Project {
    const managerBag = { fs: this.fs, logger: this.logger };
    return new Project(this.fs.join(path, name), managerBag);
  }
}
