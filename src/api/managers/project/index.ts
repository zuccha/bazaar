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
    ProjectNotValid: "ProjectManager.ProjectNotValid",
    SnapshotTargetExists: "ProjectManager.SnapshotTargetExists",
  };

  protected id = "Project";

  protected ConfigSchema = ProjectConfigSchema;
  protected defaultConfig?: ProjectConfig;

  private _baseromName = "baserom.smc";

  private get _baseromPath(): string {
    return this.path(this._baseromName);
  }

  async validate(): Promise<ResultVoid> {
    const scope = this.scope("validate");

    this.logger.start(`Checking if project "${this.path()}" exists`);
    const exists = await this.exists();
    if (!exists) {
      this.logger.failure();
      const message = `Project "${this.path()}" does not exist`;
      return R.Error(scope, message, Project.ErrorCode.ProjectNotFound);
    }
    this.logger.success();

    this.logger.start(`Checking if config "${this.configPath}" exists`);
    const configIsFile = await this.fs.isFile(this.configPath);
    if (!configIsFile) {
      this.logger.failure();
      const message = `Config "${this.configPath}" does not exist`;
      return R.Error(scope, message, Project.ErrorCode.ProjectNotValid);
    }
    this.logger.success();

    this.logger.start(`Checking if baserom "${this._baseromPath}" exists`);
    const baseromIsFile = await this.fs.isFile(this._baseromPath);
    if (!baseromIsFile) {
      this.logger.failure();
      const message = `Baserom "${this._baseromPath}" does not exist`;
      return R.Error(scope, message, Project.ErrorCode.ProjectNotValid);
    }
    this.logger.success();

    return R.Void;
  }

  async snapshot(
    targetProject: Project,
    config?: Partial<ProjectConfig>,
    partialOptions?: Partial<{ force: boolean }>,
  ): Promise<ResultVoid> {
    const scope = this.scope("snapshot");
    let result: ResultVoid;

    const options = { force: false, ...partialOptions };

    result = await this.validate();
    if (R.isError(result)) {
      return result;
    }

    this.logger.start(
      `Checking that target project "${targetProject.path()}" does't already exist`,
    );
    const targetProjectExists = await targetProject.exists();
    if (targetProjectExists) {
      this.logger.failure();
      if (!options.force) {
        const message = `Target project "${targetProject.path()}" already exists`;
        return R.Error(scope, message, Project.ErrorCode.SnapshotTargetExists);
      }

      this.logger.start(`Removing target project "${targetProject.path()}"`);
      result = await targetProject.removeDirectory();
      if (R.isError(result)) {
        this.logger.failure();
        const message = `Failed to remove target project directory "${targetProject.path()}"`;
        return R.Stack(result, scope, message, Project.ErrorCode.Generic);
      }
      this.logger.success();
    }
    this.logger.success();

    this.logger.start("Saving baserom");
    result = await this.fs.copyFile(
      this._baseromPath,
      targetProject._baseromPath,
    );
    if (R.isError(result)) {
      this.logger.failure();
      const message = "Failed to copy baserom";
      return R.Stack(result, scope, message, Project.ErrorCode.Generic);
    }
    this.logger.success();

    this.logger.start("Saving config");
    result = await this.fs.copyFile(this.configPath, targetProject.configPath);
    if (R.isError(result)) {
      this.logger.failure();
      const message = "Failed to copy config";
      return R.Stack(result, scope, message, Project.ErrorCode.Generic);
    }
    this.logger.success();

    if (config) {
      this.logger.start("Updating config");
      result = await targetProject.updateConfig(config);
      if (R.isError(result)) {
        this.logger.failure();
        return result;
      }
      this.logger.success();
    }

    return R.Void;
  }

  async createFromBaserom(
    baseromPath: string,
    partialConfig?: Partial<ProjectConfig>,
  ): Promise<ResultVoid> {
    const scope = this.scope("createFromBaserom");

    let result: ResultVoid;

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
    const config = { authors: [], version: "", ...partialConfig };
    result = await this.saveConfig(config);
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

  async openCodeEditor(): Promise<ResultVoid> {
    const result = await this.validate();
    if (R.isError(result)) return result;

    return this.editors.CodeEditor.open(this.path());
  }

  async openEmulator(): Promise<ResultVoid> {
    const result = await this.validate();
    if (R.isError(result)) return result;

    return this.editors.Emulator.open(this._baseromPath);
  }

  async openLunarMagic(): Promise<ResultVoid> {
    const result = await this.validate();
    if (R.isError(result)) return result;

    return this.tools.LunarMagic.open(this._baseromPath);
  }
}
