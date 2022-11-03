import EditorCollection from "./managers/editor-collection";
import Manager from "./managers/manager";
import OriginalRom from "./managers/original-rom";
import Project from "./managers/project";
import { ResourceBag } from "./managers/resource";
import TemplateCollection from "./managers/template-collection";
import ToolCollection from "./managers/tool-collection";
import { FS } from "./utils/fs";
import { Logger } from "./utils/logger";

export default class Api extends Manager {
  protected id = "Api";

  private readonly _resourceBag: ResourceBag;

  readonly originalRom: OriginalRom;

  readonly editors: EditorCollection;
  readonly tools: ToolCollection;

  readonly templates: TemplateCollection;

  constructor({
    cacheDirectoryPath,
    fs,
    logger,
  }: {
    cacheDirectoryPath: string;
    fs: FS;
    logger: Logger;
  }) {
    super({ fs, logger });

    this.originalRom = new OriginalRom(
      fs.join(cacheDirectoryPath, "OriginalROM"),
      this.managerBag,
    );

    this.editors = new EditorCollection(
      fs.join(cacheDirectoryPath, "Editors"),
      this.managerBag,
    );

    this.tools = new ToolCollection(
      fs.join(cacheDirectoryPath, "Tools"),
      this.managerBag,
    );

    this._resourceBag = {
      originalRom: this.originalRom,
      editors: this.editors,
      tools: this.tools,
    };

    this.templates = new TemplateCollection(
      fs.join(cacheDirectoryPath, "Templates"),
      this.managerBag,
      this._resourceBag,
    );
  }

  project(path: string, name?: string): Project {
    const directoryPath = name ? this.managerBag.fs.join(path, name) : path;
    return new Project(directoryPath, this.managerBag, this._resourceBag);
  }
}
