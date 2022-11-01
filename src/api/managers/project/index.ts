import Resource from "../../utils/resource";
import { R, ResultVoid } from "../../utils/result";
import { ProjectConfig, ProjectConfigSchema } from "./project-config";

export default class Project extends Resource<ProjectConfig> {
  static ErrorCode = {
    ...Resource.ErrorCode,
    BaseromFileNotFound: "ProjectManager.BaseromFileNotFound",
    BaseromNotFile: "ProjectManager.BaseromNotFile",
    ProjectExists: "ProjectManager.ProjectExists",
    ProjectNotFound: "ProjectManager.ProjectNotFound",
  };

  static BaseromName = "baserom.smc";

  protected ConfigSchema = ProjectConfigSchema;
  protected defaultConfig = undefined;

  protected id = "project";

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
    result = await this.fs.copyFile(
      baseromPath,
      this.path(Project.BaseromName),
    );
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

    return Promise.resolve(R.Void);
  }

  async createFromTemplate(): Promise<ResultVoid> {
    return Promise.resolve(R.Void);
  }

  async openCodeEditor(): Promise<ResultVoid> {
    return Promise.resolve(R.Void);
  }

  async openLunarMagic(): Promise<ResultVoid> {
    return Promise.resolve(R.Void);
  }

  async saveAsTemplate(): Promise<ResultVoid> {
    return Promise.resolve(R.Void);
  }
}
