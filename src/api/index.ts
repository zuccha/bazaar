import EditorManager from "./managers/editor-manager";
import OriginalRomManager from "./managers/original-rom-manager";
import ToolManager from "./managers/tool-manager";
import { FS } from "./utils/fs";

export default class Api {
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
}
