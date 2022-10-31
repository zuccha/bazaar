import EditorManager from "./managers/editor-manager";
import OriginalRomManager from "./managers/original-rom-manager";
import ProjectManager from "./managers/project-manager";
import ToolManager from "./managers/tool-manager";
import { FS } from "./utils/fs";

export default class Api {
  readonly fs: FS;
  readonly log: (message: string) => void;

  readonly editor: EditorManager;
  readonly originalRom: OriginalRomManager;
  readonly tool: ToolManager;

  constructor({
    cacheDirectoryPath,
    fs,
    log,
  }: {
    cacheDirectoryPath: string;
    fs: FS;
    log: (message: string) => void;
  }) {
    const managerBag = { fs, log };

    this.fs = fs;
    this.log = log;

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
    const managerBag = { fs: this.fs, log: this.log };
    return new ProjectManager(this.fs.join(path, name), managerBag);
  }
}
