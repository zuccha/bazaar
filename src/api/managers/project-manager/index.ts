import ConfigManager from "../../utils/config-manager";
import { R, ResultVoid } from "../../utils/result";
import { ProjectConfig, ProjectConfigSchema } from "./project-config";

export default class ProjectManager extends ConfigManager<ProjectConfig> {
  static ErrorCode = {
    ...ConfigManager.ErrorCode,
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

    this.log("Checking a project with the given name already exists...");
    if (await this.exists()) {
      const message = `A project named "${this.name}" already exists (directory "${this.path}")`;
      return R.Error(scope, message, ProjectManager.ErrorCode.ProjectExists);
    }
    this.log("A project with the given name does not exist");

    this.log("Checking if the baserom file exists...");
    const baseromPathExists = await this.fs.exists(baseromPath);
    if (!baseromPathExists) {
      const message = `The baserom file was not found`;
      return R.Error(
        scope,
        message,
        ProjectManager.ErrorCode.BaseromFileNotFound,
      );
    }
    this.log("The baserom file exists");

    this.log("Checking if the baserom file is valid...");
    const baseromIsFile = await this.fs.isFile(baseromPath);
    if (!baseromIsFile) {
      const message = `The baserom file is not actually a file`;
      return R.Error(scope, message, ProjectManager.ErrorCode.BaseromNotFile);
    }
    this.log("The baserom file is valid...");

    this.log("Creating project directory...");
    result = await this.createDirectory();
    if (R.isError(result)) {
      const message = "Failed to create project directory";
      return R.Stack(result, scope, message, ProjectManager.ErrorCode.Generic);
    }
    this.log("Project directory created");

    this.log("Copying baserom file...");
    result = await this.fs.copyFile(
      baseromPath,
      this.path(ProjectManager.BaseromName),
    );
    if (R.isError(result)) {
      await this.removeDirectory();
      const message = "Failed to copy baserom file";
      return R.Stack(result, scope, message, ProjectManager.ErrorCode.Generic);
    }
    this.log("Baserom file copied");

    this.log("Saving metadata...");
    result = await this.saveConfig({ authors, version });
    if (R.isError(result)) {
      await this.removeDirectory();
      const message = "Failed to save metadata";
      return R.Stack(result, scope, message, ProjectManager.ErrorCode.Generic);
    }
    this.log("Metadata saved");

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
