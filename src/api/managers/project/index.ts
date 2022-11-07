import { z } from "zod";
import Resource, {
  ResourceConfigSchema,
  ResourceContext,
  ResourceErrorCodes,
} from "../resource";
import { R, Result, ResultVoid } from "../../utils/result";
import { CodeEditorErrorCodes } from "../editor-collection/editors/code-editor";
import { EmulatorErrorCodes } from "../editor-collection/editors/emulator";
import { LunarMagicErrorCodes } from "../tool-collection/tools/lunar-magic";
import PatchCollection from "./patch-collection";
import { CollectionErrorCodes, CollectionInfo } from "../collection";
import Patch from "./patch-collection/patch";

export const ProjectConfigSchema = ResourceConfigSchema;

export type ProjectConfig = z.infer<typeof ProjectConfigSchema>;

export enum ProjectErrorCode {
  Internal,
  BaseromNotFound,
  BaseromNotValid,
  ProjectExists,
}

export type ProjectExtraErrorCodes = {
  Snapshot: ProjectErrorCode.Internal;
  Validate: ProjectErrorCode.BaseromNotFound | ProjectErrorCode.BaseromNotValid;
  ValidateConfig: never;
  ValidateInputConfig: never;
};

export type ProjectErrorCodes = {
  CreateFromBaserom:
    | ProjectErrorCode.Internal
    | ProjectErrorCode.BaseromNotFound
    | ProjectErrorCode.BaseromNotValid
    | ProjectErrorCode.ProjectExists;

  Validate: ResourceErrorCodes["Validate"] | ProjectExtraErrorCodes["Validate"];
  Snapshot:
    | ResourceErrorCodes["Snapshot"]
    | ProjectExtraErrorCodes["Snapshot"]
    | ProjectErrorCodes["Validate"];

  OpenCodeEditor: CodeEditorErrorCodes["Open"] | ProjectErrorCodes["Validate"];
  OpenEmulator: EmulatorErrorCodes["Open"] | ProjectErrorCodes["Validate"];
  OpenLunarMagic: LunarMagicErrorCodes["Open"] | ProjectErrorCodes["Validate"];

  ListPatches: ProjectErrorCodes["Validate"] | CollectionErrorCodes["List"];
  Patch: ProjectErrorCodes["Validate"];
};

export default class Project extends Resource<
  ProjectConfig,
  ProjectExtraErrorCodes
> {
  protected id = "Project";

  protected ConfigSchema = ProjectConfigSchema;
  protected defaultConfig?: ProjectConfig;

  private _baseromName = "baserom.smc";

  private static ResourcesDirectoryName = "Resources";

  private _patchCollection: PatchCollection;
  private _patchesDirectoryPath(...paths: string[]): string {
    return this.path(Project.ResourcesDirectoryName, "Patches", ...paths);
  }

  constructor(directoryPath: string, context: ResourceContext) {
    super(directoryPath, context);

    this._patchCollection = new PatchCollection(
      this._patchesDirectoryPath(),
      context,
    );
  }

  private get _baseromPath(): string {
    return this.path(this._baseromName);
  }

  async validate(): Promise<ResultVoid<ProjectErrorCodes["Validate"]>> {
    const scope = this.scope("validate");

    const result = await super.validate();
    if (R.isError(result)) {
      return result;
    }

    this.logger.start(`Checking if baserom exists`);
    const baseromExists = await this.fs.exists(this._baseromPath);
    if (!baseromExists) {
      this.logger.failure();
      const message = `Baserom "${this._baseromPath}" doesn't exist`;
      return R.Error(scope, message, ProjectErrorCode.BaseromNotFound);
    }
    this.logger.success();

    this.logger.start(`Checking if baserom is valid`);
    const baseromIsFile = await this.fs.isFile(this._baseromPath);
    if (!baseromIsFile) {
      this.logger.failure();
      const message = `Baserom "${this._baseromPath}" is not valid`;
      return R.Error(scope, message, ProjectErrorCode.BaseromNotValid);
    }
    this.logger.success();

    return R.Void;
  }

  async snapshot(
    targetProject: Project,
    config?: Partial<ProjectConfig>,
    partialOptions?: Partial<{ force: boolean }>,
  ): Promise<ResultVoid<ProjectErrorCodes["Snapshot"]>> {
    const scope = this.scope("snapshot");

    const snapshotResult = await super.snapshot(
      targetProject,
      config,
      partialOptions,
    );
    if (R.isError(snapshotResult)) {
      return snapshotResult;
    }

    this.logger.start("Copying baserom");
    const copyFileResult = await this.fs.copyFile(
      this._baseromPath,
      targetProject._baseromPath,
    );
    if (R.isError(copyFileResult)) {
      this.logger.failure();
      const message = `Failed to copy baserom from "${this._baseromPath}" to "${targetProject._baseromPath}"`;
      return R.Stack(copyFileResult, scope, message, ProjectErrorCode.Internal);
    }
    this.logger.success();

    return R.Void;
  }

  async createFromBaserom(
    baseromPath: string,
    partialConfig?: Partial<ProjectConfig>,
  ): Promise<ResultVoid<ProjectErrorCodes["CreateFromBaserom"]>> {
    const scope = this.scope("createFromBaserom");

    this.logger.start("Checking if a project with same name already exists");
    if (await this.exists()) {
      this.logger.failure();
      const message = `The project "${this.path()}" already exists`;
      return R.Error(scope, message, ProjectErrorCode.ProjectExists);
    }
    this.logger.success();

    this.logger.start("Checking if the baserom exists");
    const baseromPathExists = await this.fs.exists(baseromPath);
    if (!baseromPathExists) {
      this.logger.failure();
      const message = `The baserom "${baseromPath}" was not found`;
      return R.Error(scope, message, ProjectErrorCode.BaseromNotFound);
    }
    this.logger.success();

    this.logger.start("Checking if the baserom is valid");
    const baseromIsFile = await this.fs.isFile(baseromPath);
    if (!baseromIsFile) {
      this.logger.failure();
      const message = `The baserom "${baseromPath}" is not valid`;
      return R.Error(scope, message, ProjectErrorCode.BaseromNotValid);
    }
    this.logger.success();

    this.logger.start("Creating project directory");
    const createDirectoryResult = await this.createDirectory();
    if (R.isError(createDirectoryResult)) {
      this.logger.failure();
      const message = `Failed to create project directory "${this.path()}"`;
      return R.Stack(
        createDirectoryResult,
        scope,
        message,
        ProjectErrorCode.Internal,
      );
    }
    this.logger.success();

    this.logger.start("Copying baserom file");
    const copyBaseromResult = await this.fs.copyFile(
      baseromPath,
      this._baseromPath,
    );
    if (R.isError(copyBaseromResult)) {
      this.logger.failure();
      await this.removeDirectory();
      const message = `Failed to copy baserom file from "${baseromPath}" to "${this._baseromPath}"`;
      return R.Stack(
        copyBaseromResult,
        scope,
        message,
        ProjectErrorCode.Internal,
      );
    }
    this.logger.success();

    this.logger.start("Saving metadata");
    const config = { authors: [], version: "", ...partialConfig };
    const saveConfigResult = await this.saveConfig(config);
    if (R.isError(saveConfigResult)) {
      this.logger.failure();
      await this.removeDirectory();
      const message = "Failed to save metadata";
      return R.Stack(
        saveConfigResult,
        scope,
        message,
        ProjectErrorCode.Internal,
      );
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
      const copyOriginalRomResult = await this.fs.copyFile(
        originalRomInfoResult.data.filePath,
        this.path("sysLMRestore", "smwOrig.smc"),
      );
      if (R.isError(copyOriginalRomResult)) {
        this.logger.failure();
      } else {
        this.logger.success();
      }
    } else {
      this.logger.failure();
      this.logger.log("Original ROM is not available, ignoring");
    }

    return R.Void;
  }

  async openCodeEditor(): Promise<
    ResultVoid<ProjectErrorCodes["OpenCodeEditor"]>
  > {
    this.logger.start("Verifying that project is valid");
    const validateResult = await this.validate();
    if (R.isError(validateResult)) {
      this.logger.failure();
      return validateResult;
    }
    this.logger.success();

    this.logger.start("Opening project in code editor");
    const openCodeEditorResult = await this.editors.CodeEditor.open(
      this.path(),
    );
    if (R.isError(openCodeEditorResult)) {
      this.logger.failure();
      return openCodeEditorResult;
    }
    this.logger.success();

    return R.Void;
  }

  async openEmulator(): Promise<ResultVoid<ProjectErrorCodes["OpenEmulator"]>> {
    this.logger.start("Verifying that project is valid");
    const validateResult = await this.validate();
    if (R.isError(validateResult)) {
      this.logger.failure();
      return validateResult;
    }
    this.logger.success();

    this.logger.start("Running project baserom in emulator");
    const openEmulatorResult = await this.editors.Emulator.open(
      this._baseromPath,
    );
    if (R.isError(openEmulatorResult)) {
      this.logger.failure();
      return openEmulatorResult;
    }
    this.logger.success();

    return R.Void;
  }

  async openLunarMagic(): Promise<
    ResultVoid<ProjectErrorCodes["OpenLunarMagic"]>
  > {
    this.logger.start("Verifying that project is valid");
    const validateResult = await this.validate();
    if (R.isError(validateResult)) {
      this.logger.failure();
      return validateResult;
    }
    this.logger.success();

    this.logger.start("Opening the project in Lunar Magic");
    const openLunarMagicResult = await this.tools.LunarMagic.open(
      this._baseromPath,
    );
    if (R.isError(openLunarMagicResult)) {
      this.logger.failure();
      return openLunarMagicResult;
    }
    this.logger.success();

    return R.Void;
  }

  async listPatches(): Promise<
    Result<CollectionInfo[], ProjectErrorCodes["ListPatches"]>
  > {
    this.logger.start("Verifying that project is valid");
    const validateResult = await this.validate();
    if (R.isError(validateResult)) {
      this.logger.failure();
      return validateResult;
    }
    this.logger.success();

    this.logger.start("Gathering patches directory info");
    const result = await this._patchCollection.list();
    if (R.isError(result)) {
      this.logger.failure();
      return result;
    }
    this.logger.failure();
    return result;
  }

  async patch(
    name: string,
  ): Promise<Result<Patch, ProjectErrorCodes["Patch"]>> {
    this.logger.start("Verifying that project is valid");
    const validateResult = await this.validate();
    if (R.isError(validateResult)) {
      this.logger.failure();
      return validateResult;
    }
    this.logger.success();

    return R.Ok(this._patchCollection.get(name));
  }
}
