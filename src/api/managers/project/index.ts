import { z } from "zod";
import Resource from "../resource";
import { R, Result, ResultVoid } from "../../utils/result";
import SemVer from "../../utils/sem-ver";

export const ProjectConfigSchema = z.object({
  authors: z.array(z.string()),
  version: z.string(),
});

export type ProjectConfig = z.infer<typeof ProjectConfigSchema>;

export default class Project extends Resource<ProjectConfig> {
  static ErrorCode = {
    ...Resource.ErrorCode,
    BaseromFileNotFound: "Project.BaseromFileNotFound",
    BaseromNotFile: "Project.BaseromNotFile",
    ProjectExists: "Project.ProjectExists",
    ProjectNotFound: "Project.ProjectNotFound",
    ProjectNotValid: "Project.ProjectNotValid",
    SnapshotTargetExists: "Project.SnapshotTargetExists",
    VersionNotValid: "Project.VersionNotValid",
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

    this.logger.start(`Checking if project exists`);
    const exists = await this.exists();
    if (!exists) {
      this.logger.failure();
      const message = `Project "${this.path()}" does not exist`;
      return R.Error(scope, message, Project.ErrorCode.ProjectNotFound);
    }
    this.logger.success();

    this.logger.start(`Checking if config exists`);
    const configIsFile = await this.fs.isFile(this.configPath);
    if (!configIsFile) {
      this.logger.failure();
      const message = `Config "${this.configPath}" does not exist`;
      return R.Error(scope, message, Project.ErrorCode.ProjectNotValid);
    }
    this.logger.success();

    this.logger.start(`Checking if baserom exists`);
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

    this.logger.start("Verifying that source project is valid");
    result = await this.validate();
    if (R.isError(result)) {
      this.logger.failure();
      return result;
    }
    this.logger.success();

    this.logger.start(`Checking that target project does't already exist`);
    const targetProjectExists = await targetProject.exists();
    if (targetProjectExists) {
      this.logger.failure();
      if (!options.force) {
        const message = `Target project "${targetProject.path()}" already exists`;
        return R.Error(scope, message, Project.ErrorCode.SnapshotTargetExists);
      }

      this.logger.start(`Removing target project`);
      result = await targetProject.removeDirectory();
      if (R.isError(result)) {
        this.logger.failure();
        const message = `Failed to remove target project "${targetProject.path()}"`;
        return R.Stack(result, scope, message, Project.ErrorCode.Generic);
      }
      this.logger.success();
    } else {
      this.logger.success();
    }

    this.logger.start("Copying baserom");
    result = await this.fs.copyFile(
      this._baseromPath,
      targetProject._baseromPath,
    );
    if (R.isError(result)) {
      this.logger.failure();
      const message = `Failed to copy baserom from "${this._baseromPath}" to "${targetProject._baseromPath}"`;
      return R.Stack(result, scope, message, Project.ErrorCode.Generic);
    }
    this.logger.success();

    this.logger.start("Copying config");
    result = await this.fs.copyFile(this.configPath, targetProject.configPath);
    if (R.isError(result)) {
      this.logger.failure();
      const message = `Failed to copy baserom from "${this.configPath}" to "${targetProject.configPath}"`;
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
      const message = `The project "${this.path()}" already exists`;
      return R.Error(scope, message, Project.ErrorCode.ProjectExists);
    }
    this.logger.success();

    this.logger.start("Checking if the baserom exists");
    const baseromPathExists = await this.fs.exists(baseromPath);
    if (!baseromPathExists) {
      this.logger.failure();
      const message = `The baserom "${baseromPath}" was not found`;
      return R.Error(scope, message, Project.ErrorCode.BaseromFileNotFound);
    }
    this.logger.success();

    this.logger.start("Checking if the baserom is valid");
    const baseromIsFile = await this.fs.isFile(baseromPath);
    if (!baseromIsFile) {
      this.logger.failure();
      const message = `The baserom "${baseromPath}" is not valid`;
      return R.Error(scope, message, Project.ErrorCode.BaseromNotFile);
    }
    this.logger.success();

    this.logger.start("Creating project directory");
    result = await this.createDirectory();
    if (R.isError(result)) {
      this.logger.failure();
      const message = `Failed to create project directory "${this.path()}"`;
      return R.Stack(result, scope, message, Project.ErrorCode.Generic);
    }
    this.logger.success();

    this.logger.start("Copying baserom file");
    result = await this.fs.copyFile(baseromPath, this._baseromPath);
    if (R.isError(result)) {
      this.logger.failure();
      await this.removeDirectory();
      const message = `Failed to copy baserom file from "${baseromPath}" to "${this._baseromPath}"`;
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

  async remove(): Promise<ResultVoid> {
    let result: ResultVoid;

    this.logger.start("Verifying that project is valid");
    result = await this.validate();
    if (R.isError(result)) {
      this.logger.failure();
      return result;
    }
    this.logger.success();

    this.logger.start("Removing project directory");
    result = await this.removeDirectory();
    if (R.isError(result)) {
      this.logger.failure();
      return result;
    }
    this.logger.success();

    return R.Void;
  }

  async openCodeEditor(): Promise<ResultVoid> {
    let result: ResultVoid;

    this.logger.start("Verifying that project is valid");
    result = await this.validate();
    if (R.isError(result)) {
      this.logger.failure();
      return result;
    }
    this.logger.success();

    this.logger.start("Opening project in code editor");
    result = await this.editors.CodeEditor.open(this.path());
    if (R.isError(result)) {
      this.logger.failure();
      return result;
    }
    this.logger.success();

    return R.Void;
  }

  async openEmulator(): Promise<ResultVoid> {
    let result: ResultVoid;

    this.logger.start("Verifying that project is valid");
    result = await this.validate();
    if (R.isError(result)) {
      this.logger.failure();
      return result;
    }
    this.logger.success();

    this.logger.start("Running project baserom in emulator");
    result = await this.editors.Emulator.open(this._baseromPath);
    if (R.isError(result)) {
      this.logger.failure();
      return result;
    }
    this.logger.success();

    return R.Void;
  }

  async openLunarMagic(): Promise<ResultVoid> {
    let result: ResultVoid;

    this.logger.start("Verifying that project is valid");
    result = await this.validate();
    if (R.isError(result)) {
      this.logger.failure();
      return result;
    }
    this.logger.success();

    this.logger.start("Opening the project in Lunar Magic");
    result = await this.tools.LunarMagic.open(this._baseromPath);
    if (R.isError(result)) {
      this.logger.failure();
      return result;
    }
    this.logger.success();

    return R.Void;
  }

  async getMetadata(): Promise<Result<ProjectConfig>> {
    this.logger.start("Verifying that project is valid");
    const result = await this.validate();
    if (R.isError(result)) {
      this.logger.failure();
      return result;
    }
    this.logger.success();

    return this.loadConfig();
  }

  async updateMetadata(metadata: Partial<ProjectConfig>): Promise<ResultVoid> {
    this.logger.start("Verifying that project is valid");
    const result = await this.validate();
    if (R.isError(result)) {
      this.logger.failure();
      return result;
    }
    this.logger.success();

    return this.updateConfig(metadata);
  }

  private async _increaseVersion(
    scope: string,
    increase: (version: string) => Result<string>,
  ): Promise<ResultVoid> {
    let result: ResultVoid;

    this.logger.start("Verifying that project is valid");
    result = await this.validate();
    if (R.isError(result)) {
      this.logger.failure();
      return result;
    }
    this.logger.success();

    this.logger.start("Reading metadata");
    const configResult = await this.loadConfig();
    if (R.isError(configResult)) {
      this.logger.failure();
      return configResult;
    }
    this.logger.success();

    this.logger.start("Incrementing version automatically");
    const versionResult = increase(configResult.data.version);
    if (R.isError(versionResult)) {
      this.logger.failure();
      const message = `The version "${configResult.data.version}" of the project cannot be incremented automatically`;
      return R.Error(scope, message, Project.ErrorCode.VersionNotValid);
    }
    this.logger.success();

    this.logger.start("Writing metadata");
    result = await this.updateConfig({ version: versionResult.data });
    if (R.isError(result)) {
      this.logger.failure();
      return result;
    }
    this.logger.success();

    return R.Void;
  }

  async increaseMajorVersion(): Promise<ResultVoid> {
    const scope = this.scope("increaseMajorVersion");
    return this._increaseVersion(scope, SemVer.increaseMajor);
  }

  async increaseMinorVersion(): Promise<ResultVoid> {
    const scope = this.scope("increaseMinorVersion");
    return this._increaseVersion(scope, SemVer.increaseMinor);
  }

  async increasePatchVersion(): Promise<ResultVoid> {
    const scope = this.scope("increasePatchVersion");
    return this._increaseVersion(scope, SemVer.increasePatch);
  }
}
