import EditorCollection from "./managers/editor-collection";
import OriginalRom from "./managers/original-rom";
import Project from "./managers/project";
import { ResourceContext } from "./managers/resource";
import TemplateCollection from "./managers/template-collection";
import ToolCollection from "./managers/tool-collection";
import { FS } from "./utils/fs";
import { Logger } from "./utils/logger";

export default class Api {
  protected id = "Api";

  private readonly _context: ResourceContext;

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
    const managerContext = { fs, logger };

    this.originalRom = new OriginalRom(
      fs.join(cacheDirectoryPath, "OriginalROM"),
      managerContext,
    );

    this.editors = new EditorCollection(
      fs.join(cacheDirectoryPath, "Editors"),
      managerContext,
    );

    this.tools = new ToolCollection(
      fs.join(cacheDirectoryPath, "Tools"),
      managerContext,
    );

    this._context = {
      ...managerContext,
      originalRom: this.originalRom,
      editors: this.editors,
      tools: this.tools,
    };

    this.templates = new TemplateCollection(
      fs.join(cacheDirectoryPath, "Templates"),
      this._context,
    );
  }

  project(path: string, name?: string): Project {
    const directoryPath = name ? this._context.fs.join(path, name) : path;
    return new Project(directoryPath, this._context);
  }
}
