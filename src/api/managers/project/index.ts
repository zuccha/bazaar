import { z } from "zod";
import Resource from "../resource";
import { R, ResultVoid } from "../../utils/result";

export const ProjectConfigSchema = z.object({
  authors: z.array(z.string()),
  version: z.string(),
});

export type ProjectConfig = z.infer<typeof ProjectConfigSchema>;

export default class Project extends Resource<ProjectConfig> {
  static ErrorCode = {
    ...Resource.ErrorCode,
    BaseromFileNotFound: "ProjectManager.BaseromFileNotFound",
    BaseromNotFile: "ProjectManager.BaseromNotFile",
    ProjectExists: "ProjectManager.ProjectExists",
    ProjectNotFound: "ProjectManager.ProjectNotFound",
  };

  protected id = "Project";

  protected ConfigSchema = ProjectConfigSchema;
  protected defaultConfig = undefined;

  private _baseromName = "baserom.smc";

  private get _baseromPath(): string {
    return this.path(this._baseromName);
  }

  async createFromBaserom(params: {
    baseromPath: string;
    authors?: string[];
    version?: string;
  }): Promise<ResultVoid> {
    const scope = this.scope("createFromBaserom");

    let result: ResultVoid;

    const baseromPath = params.baseromPath;
    const authors = params.authors ?? [];
    const version = params.version ?? "";

    this.logger.start("Checking if a project with same name already exists");
    if (await this.exists()) {
      this.logger.failure();
      const message = `A project named "${this.name}" already exists (directory "${this.path}")`;
      return R.Error(scope, message, Project.ErrorCode.ProjectExists);
    }
    this.logger.success();

    this.logger.start("Checking if the baserom file exists");
    const baseromPathExists = await this.fs.exists(baseromPath);
    if (!baseromPathExists) {
      this.logger.failure();
      const message = `The baserom file was not found`;
      return R.Error(scope, message, Project.ErrorCode.BaseromFileNotFound);
    }
    this.logger.success();

    this.logger.start("Checking if the baserom file is valid");
    const baseromIsFile = await this.fs.isFile(baseromPath);
    if (!baseromIsFile) {
      this.logger.failure();
      const message = `The baserom file is not actually a file`;
      return R.Error(scope, message, Project.ErrorCode.BaseromNotFile);
    }
    this.logger.success();

    this.logger.start("Creating project directory");
    result = await this.createDirectory();
    if (R.isError(result)) {
      this.logger.failure();
      const message = "Failed to create project directory";
      return R.Stack(result, scope, message, Project.ErrorCode.Generic);
    }
    this.logger.success();

    this.logger.start("Copying baserom file");
    result = await this.fs.copyFile(baseromPath, this._baseromPath);
    if (R.isError(result)) {
      this.logger.failure();
      await this.removeDirectory();
      const message = "Failed to copy baserom file";
      return R.Stack(result, scope, message, Project.ErrorCode.Generic);
    }
    this.logger.success();

    this.logger.start("Saving metadata");
    result = await this.saveConfig({ authors, version });
    if (R.isError(result)) {
      this.logger.failure();
      await this.removeDirectory();
      const message = "Failed to save metadata";
      return R.Stack(result, scope, message, Project.ErrorCode.Generic);
    }
    this.logger.success();

    this.logger.start("Checking if the original ROM is available");
    const originalRomInfoResult = await this.originalRom.list();
    if (R.isError(originalRomInfoResult)) {
      this.logger.failure();
      this.logger.log("Failed to tell if original ROM is available, ignoring");
    } else if (originalRomInfoResult.data.filePath) {
      this.logger.success();
      this.logger.start("Copying original ROM in sysLMRestore directory");
      result = await this.fs.copyFile(
        originalRomInfoResult.data.filePath,
        this.path("sysLMRestore", "smwOrig.smc"),
      );
      if (R.isError(result)) {
        this.logger.failure();
      } else {
        this.logger.success();
      }
    } else {
      this.logger.failure();
      this.logger.log("Original ROM is not available, ignoring");
    }

    return Promise.resolve(R.Void);
  }

  async createFromTemplate(): Promise<ResultVoid> {
    return Promise.resolve(R.Void);
  }

  async openCodeEditor(): Promise<ResultVoid> {
    return this.editors.CodeEditor.open(this.path());
  }

  async openEmulator(): Promise<ResultVoid> {
    return this.editors.Emulator.open(this._baseromPath);
  }

  async openLunarMagic(): Promise<ResultVoid> {
    return this.tools.LunarMagic.open(this._baseromPath);
  }

  async saveAsTemplate(): Promise<ResultVoid> {
    return Promise.resolve(R.Void);
  }
}
