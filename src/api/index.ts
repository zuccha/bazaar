import EditorManager from "./managers/editor-manager";
import OriginalRomManager from "./managers/original-rom-manager";
import ProjectManager from "./managers/project-manager";
import ToolManager from "./managers/tool-manager";
import { FS } from "./utils/fs";
import { Logger } from "./utils/logger";

export default class Api {
  readonly fs: FS;
  readonly logger: Logger;

  readonly editor: EditorManager;
  readonly originalRom: OriginalRomManager;
  readonly tool: ToolManager;

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

    this.editor = new EditorManager(
      fs.join(cacheDirectoryPath, "Editors"),
      managerBag,
    );

    this.originalRom = new OriginalRomManager(
      fs.join(cacheDirectoryPath, "OriginalROM"),
      managerBag,
    );

    this.tool = new ToolManager(
      fs.join(cacheDirectoryPath, "Tools"),
      managerBag,
    );
  }

  project(name: string, path: string): ProjectManager {
    const managerBag = { fs: this.fs, logger: this.logger };
    return new ProjectManager(this.fs.join(path, name), managerBag);
  }
}
