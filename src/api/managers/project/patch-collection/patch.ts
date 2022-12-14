import { z } from "zod";
import { R, ResultVoid } from "../../../utils/result";
import { ConfigurableErrorCodes } from "../../configurable";
import { CodeEditorErrorCodes } from "../../editor-collection/editors/code-editor";
import Resource, {
  ResourceConfigSchema,
  ResourceErrorCodes,
} from "../../resource";

const PatchConfigSchema = ResourceConfigSchema.extend({
  mainFileRelativePath: z.string(),
});

export type PatchConfig = z.infer<typeof PatchConfigSchema>;

export enum PatchErrorCode {
  Internal,
  CodeDirectoryNotFound,
  CodeDirectoryNotValid,
  InputCodeDirectoryNotFound,
  InputCodeDirectoryNotValid,
  InputMainFileNotFound,
  InputMainFileNotValid,
  InputMainFileNotAsm,
  InputMainFileNotInsideCodeDirectory,
  MainFileNotFound,
  MainFileNotValid,
  MainFileNotAsm,
  PatchAlreadyExists,
}

export type PatchExtraErrorCodes = {
  Snapshot: PatchErrorCode.Internal;
  Validate:
    | ConfigurableErrorCodes["LoadConfig"]
    | PatchErrorCode.CodeDirectoryNotFound
    | PatchErrorCode.CodeDirectoryNotValid
    | PatchErrorCode.MainFileNotFound
    | PatchErrorCode.MainFileNotValid
    | PatchErrorCode.MainFileNotAsm;
  ValidateConfig: never;
  ValidateInputConfig:
    | PatchErrorCode.InputMainFileNotFound
    | PatchErrorCode.InputMainFileNotValid
    | PatchErrorCode.InputMainFileNotAsm;
};

export type PatchErrorCodes = {
  ValidateInputConfig:
    | ResourceErrorCodes["ValidateInputConfig"]
    | PatchExtraErrorCodes["ValidateInputConfig"];

  Validate: ResourceErrorCodes["Validate"] | PatchExtraErrorCodes["Validate"];
  Snapshot:
    | ResourceErrorCodes["Snapshot"]
    | PatchExtraErrorCodes["Snapshot"]
    | PatchErrorCodes["Validate"]
    | PatchErrorCodes["ValidateInputConfig"];

  CreateFromSingleFile:
    | PatchErrorCodes["ValidateInputConfig"]
    | PatchErrorCode.Internal
    | PatchErrorCode.PatchAlreadyExists;
  CreateFromDirectory:
    | PatchErrorCodes["ValidateInputConfig"]
    | PatchErrorCode.Internal
    | PatchErrorCode.InputCodeDirectoryNotFound
    | PatchErrorCode.InputCodeDirectoryNotValid
    | PatchErrorCode.InputMainFileNotInsideCodeDirectory
    | PatchErrorCode.PatchAlreadyExists;

  OpenCodeDirectory: PatchErrorCodes["Validate"] | CodeEditorErrorCodes["Open"];
  OpenMainFile: PatchErrorCodes["Validate"] | CodeEditorErrorCodes["Open"];
};

export default class Patch extends Resource<PatchConfig, PatchExtraErrorCodes> {
  protected id = "Patch";

  protected ConfigSchema = PatchConfigSchema;
  protected defaultConfig?: PatchConfig;

  private _codeDirectoryPath(...paths: string[]): string {
    return this.path("Code", ...paths);
  }

  protected async validateInputConfig(
    partialConfig?: Partial<PatchConfig>,
  ): Promise<ResultVoid<PatchErrorCodes["ValidateInputConfig"]>> {
    const scope = this.scope("_validateInputConfig");

    const superResult = await super.validateInputConfig(partialConfig);
    if (R.isError(superResult)) {
      return superResult;
    }

    if (partialConfig?.mainFileRelativePath) {
      // In the input config, we use the relative path as an absolute path.
      const mainFilePath = partialConfig.mainFileRelativePath;

      this.logger.start("Checking if input main file exists");
      const mainFileExists = await this.fs.exists(mainFilePath);
      if (!mainFileExists) {
        this.logger.failure();
        const message = `Input main file "${mainFilePath}" doesn't exist`;
        return R.Error(scope, message, PatchErrorCode.InputMainFileNotFound);
      }
      this.logger.success();

      this.logger.start("Checking if input main file is valid");
      const mainFileIsFile = await this.fs.isFile(mainFilePath);
      if (!mainFileIsFile) {
        this.logger.failure();
        const message = `Input main file "${mainFilePath}" is not valid`;
        return R.Error(scope, message, PatchErrorCode.InputMainFileNotValid);
      }
      this.logger.success();

      this.logger.start("Checking if input main file is an ASM file");
      const mainFileExtension = this.fs.getExtension(mainFilePath);
      if (mainFileExtension !== ".asm") {
        this.logger.failure();
        const message = `Input main file "${mainFilePath}" doesn't have ".asm" extension`;
        return R.Error(scope, message, PatchErrorCode.InputMainFileNotAsm);
      }
      this.logger.success();
    }

    return R.Void;
  }

  async validate(): Promise<ResultVoid<PatchErrorCodes["Validate"]>> {
    const scope = this.scope("validate");

    this.logger.start("Load config");
    const configResult = await this.loadConfig();
    if (R.isError(configResult)) {
      this.logger.failure;
      return configResult;
    }
    this.logger.success();

    const mainFilePath = this._codeDirectoryPath(
      configResult.data.mainFileRelativePath,
    );

    this.logger.start(`Checking if code directory exists exists`);
    const codeDirectoryExists = await this.fs.exists(this._codeDirectoryPath());
    if (!codeDirectoryExists) {
      this.logger.failure();
      const message = `Code directory "${this._codeDirectoryPath()}" doesn't exist`;
      return R.Error(scope, message, PatchErrorCode.CodeDirectoryNotFound);
    }
    this.logger.success();

    this.logger.start(`Checking if code directory is valid`);
    const codeDirectoryIsValid = await this.fs.isDirectory(
      this._codeDirectoryPath(),
    );
    if (!codeDirectoryIsValid) {
      this.logger.failure();
      const message = `Code directory "${this._codeDirectoryPath()}" is not valid`;
      return R.Error(scope, message, PatchErrorCode.CodeDirectoryNotValid);
    }
    this.logger.success();

    this.logger.start(`Checking if main code file exists`);
    const mainFilePathExists = await this.fs.exists(mainFilePath);
    if (!mainFilePathExists) {
      this.logger.failure();
      const message = `Main code file "${mainFilePath}" is not valid`;
      return R.Error(scope, message, PatchErrorCode.MainFileNotFound);
    }
    this.logger.success();

    this.logger.start(`Checking if code main file is valid`);
    const mainFilePathIsFile = await this.fs.isFile(mainFilePath);
    if (!mainFilePathIsFile) {
      this.logger.failure();
      const message = `Main code file "${mainFilePath}" is not valid`;
      return R.Error(scope, message, PatchErrorCode.MainFileNotFound);
    }
    this.logger.success();

    this.logger.start(`Checking if code main file is an ASM file`);
    const mainFileExtension = this.fs.getExtension(mainFilePath);
    if (mainFileExtension !== ".asm") {
      this.logger.failure();
      const message = `Main code file "${mainFilePath}" doesn't have ".asm" extension`;
      return R.Error(scope, message, PatchErrorCode.MainFileNotAsm);
    }
    this.logger.success();

    return R.Void;
  }

  async snapshot(
    targetPatch: Patch,
    config?: Partial<PatchConfig> | undefined,
    partialOptions?:
      | Partial<{ force: boolean; config: Partial<PatchConfig> }>
      | undefined,
  ): Promise<ResultVoid<PatchErrorCodes["Snapshot"]>> {
    const scope = this.scope("snapshot");

    const snapshotResult = await super.snapshot(
      targetPatch,
      config,
      partialOptions,
    );
    if (R.isError(snapshotResult)) {
      return snapshotResult;
    }

    this.logger.start("Copying code directory");
    const copyCodeDirectoryResult = await this.fs.copyDirectory(
      this._codeDirectoryPath(),
      targetPatch._codeDirectoryPath(),
    );
    if (R.isError(copyCodeDirectoryResult)) {
      this.logger.failure();
      return R.Stack(
        copyCodeDirectoryResult,
        scope,
        `Failed to copy code directory from "${this._codeDirectoryPath()}" to "${targetPatch._codeDirectoryPath()}"`,
        PatchErrorCode.Internal,
      );
    }
    this.logger.success();

    return R.Void;
  }

  async createFromSingleFile(
    sourceCodeFilePath: string,
    partialConfig: Partial<Omit<PatchConfig, "mainFileRelativePath">>,
  ): Promise<ResultVoid<PatchErrorCodes["CreateFromSingleFile"]>> {
    const scope = this.scope("createFromSingleFile");

    const inputConfig: PatchConfig = {
      mainFileRelativePath: sourceCodeFilePath,
      authors: partialConfig.authors ?? [],
      version: partialConfig.version ?? "",
    };

    this.logger.start("Checking if the project doesn't already exist");
    const exists = await this.exists();
    if (exists) {
      this.logger.failure();
      const message = `Project "${this.path()}" already exists`;
      return R.Error(scope, message, PatchErrorCode.PatchAlreadyExists);
    }
    this.logger.success();

    this.logger.start("Validating input config");
    const validateInputConfigResult = await this.validateInputConfig(
      inputConfig,
    );
    if (R.isError(validateInputConfigResult)) {
      this.logger.failure();
      return validateInputConfigResult;
    }
    this.logger.success();

    this.logger.start("Creating patch directory");
    const createDirectoryResult = await this.createDirectory();
    if (R.isError(createDirectoryResult)) {
      this.logger.failure();
      const message = `Failed to create patch directory "${this.path()}"`;
      return R.Stack(
        createDirectoryResult,
        scope,
        message,
        PatchErrorCode.Internal,
      );
    }
    this.logger.success();

    const config: PatchConfig = {
      mainFileRelativePath: this.fs.getName(sourceCodeFilePath),
      authors: inputConfig.authors,
      version: inputConfig.version,
    };

    this.logger.start("Saving metadata");
    const saveConfigResult = await this.saveConfig(config);
    if (R.isError(saveConfigResult)) {
      this.logger.failure();
      await this.removeDirectory();
      const message = `Failed to save metadata`;
      return R.Stack(saveConfigResult, scope, message, PatchErrorCode.Internal);
    }
    this.logger.success();

    this.logger.start("Copying code file");
    const targetCodeFilePath = this._codeDirectoryPath(
      config.mainFileRelativePath,
    );
    const copyCodeFileResult = await this.fs.copyFile(
      sourceCodeFilePath,
      targetCodeFilePath,
    );
    if (R.isError(copyCodeFileResult)) {
      this.logger.failure();
      await this.removeDirectory();
      const message = `Failed to copy code file from "${sourceCodeFilePath}" to "${targetCodeFilePath}"`;
      return R.Stack(
        copyCodeFileResult,
        scope,
        message,
        PatchErrorCode.Internal,
      );
    }
    this.logger.success();

    return R.Void;
  }

  async createFromDirectory(
    sourceCodeDirectoryPath: string,
    sourceMainCodeFilePath: string,
    partialConfig: Partial<Omit<PatchConfig, "mainFileRelativePath">>,
  ): Promise<ResultVoid<PatchErrorCodes["CreateFromDirectory"]>> {
    const scope = this.scope("createFromDirectory");

    const inputConfig: PatchConfig = {
      mainFileRelativePath: sourceMainCodeFilePath,
      authors: partialConfig.authors ?? [],
      version: partialConfig.version ?? "",
    };

    this.logger.start("Checking if the project doesn't already exist");
    const exists = await this.exists();
    if (exists) {
      this.logger.failure();
      const message = `Project "${this.path()}" already exists`;
      return R.Error(scope, message, PatchErrorCode.PatchAlreadyExists);
    }
    this.logger.success();

    this.logger.start("Checking if the code directory exist");
    const sourceCodeDirectoryPathExists = await this.fs.exists(
      sourceCodeDirectoryPath,
    );
    if (!sourceCodeDirectoryPathExists) {
      this.logger.failure();
      const message = `Source code directory "${sourceCodeDirectoryPath}" doesn't exist`;
      return R.Error(scope, message, PatchErrorCode.InputCodeDirectoryNotFound);
    }
    this.logger.success();

    this.logger.start("Checking if the code directory is valid");
    const sourceCodeDirectoryPathIsValid = await this.fs.exists(
      sourceCodeDirectoryPath,
    );
    if (!sourceCodeDirectoryPathIsValid) {
      this.logger.failure();
      const message = `Source code directory "${sourceCodeDirectoryPath}" is not valid`;
      return R.Error(scope, message, PatchErrorCode.InputCodeDirectoryNotValid);
    }
    this.logger.success();

    this.logger.start("Checking main code file is inside code directory");
    const mainCodeFileIsInsideCodeDirectory = this.fs.isInside(
      sourceCodeDirectoryPath,
      sourceMainCodeFilePath,
    );
    if (!mainCodeFileIsInsideCodeDirectory) {
      this.logger.failure();
      const message = `Main code file "${sourceMainCodeFilePath}" is not inside "${sourceCodeDirectoryPath}"`;
      return R.Error(
        scope,
        message,
        PatchErrorCode.InputMainFileNotInsideCodeDirectory,
      );
    }
    this.logger.success();

    this.logger.start("Validating input config");
    const validateInputConfigResult = await this.validateInputConfig(
      inputConfig,
    );
    if (R.isError(validateInputConfigResult)) {
      this.logger.failure();
      return validateInputConfigResult;
    }
    this.logger.success();

    this.logger.start("Creating patch directory");
    const createDirectoryResult = await this.createDirectory();
    if (R.isError(createDirectoryResult)) {
      this.logger.failure();
      const message = `Failed to create patch directory "${this.path()}"`;
      return R.Stack(
        createDirectoryResult,
        scope,
        message,
        PatchErrorCode.Internal,
      );
    }
    this.logger.success();

    const config: PatchConfig = {
      mainFileRelativePath: this.fs.getRelativePath(
        sourceCodeDirectoryPath,
        sourceMainCodeFilePath,
      ),
      authors: inputConfig.authors,
      version: inputConfig.version,
    };

    this.logger.start("Saving metadata");
    const saveConfigResult = await this.saveConfig(config);
    if (R.isError(saveConfigResult)) {
      this.logger.failure();
      await this.removeDirectory();
      const message = `Failed to save metadata`;
      return R.Stack(saveConfigResult, scope, message, PatchErrorCode.Internal);
    }
    this.logger.success();

    this.logger.start("Copying code directory");
    const targetCodeDirectoryPath = this._codeDirectoryPath();
    const copyCodeDirectoryResult = await this.fs.copyDirectory(
      sourceCodeDirectoryPath,
      targetCodeDirectoryPath,
    );
    if (R.isError(copyCodeDirectoryResult)) {
      this.logger.failure();
      await this.removeDirectory();
      const message = `Failed to copy code directory from "${sourceCodeDirectoryPath}" to "${targetCodeDirectoryPath}"`;
      return R.Stack(
        copyCodeDirectoryResult,
        scope,
        message,
        PatchErrorCode.Internal,
      );
    }
    this.logger.success();

    return R.Void;
  }

  async openCodeDirectory(): Promise<
    ResultVoid<PatchErrorCodes["OpenCodeDirectory"]>
  > {
    this.logger.start("Verifying that patch is valid");
    const validateResult = await this.validate();
    if (R.isError(validateResult)) {
      this.logger.failure();
      return validateResult;
    }
    this.logger.success();

    this.logger.start("Opening patch code directory in code editor");
    const openCodeEditorResult = await this.editors.CodeEditor.open(
      this._codeDirectoryPath(),
    );
    if (R.isError(openCodeEditorResult)) {
      this.logger.failure();
      return openCodeEditorResult;
    }
    this.logger.success();

    return R.Void;
  }

  async openMainFile(): Promise<ResultVoid<PatchErrorCodes["OpenMainFile"]>> {
    this.logger.start("Verifying that patch is valid");
    const validateResult = await this.validate();
    if (R.isError(validateResult)) {
      this.logger.failure();
      return validateResult;
    }
    this.logger.success();

    this.logger.start("Loading metadata");
    const metadataResult = await this.loadConfig();
    if (R.isError(metadataResult)) {
      this.logger.failure();
      return metadataResult;
    }
    this.logger.success();

    this.logger.start("Opening patch main file in code editor");
    const { mainFileRelativePath } = metadataResult.data;
    const openCodeEditorResult = await this.editors.CodeEditor.open(
      this._codeDirectoryPath(mainFileRelativePath),
    );
    if (R.isError(openCodeEditorResult)) {
      this.logger.failure();
      return openCodeEditorResult;
    }
    this.logger.success();

    return R.Void;
  }
}
