import { z } from "zod";
import Configurable, { ConfigurableErrorCodes } from "../configurable";
import { ShellOutput } from "../../utils/fs";
import { R, Result, ResultVoid } from "../../utils/result";

export const EditorConfigSchema = z.object({
  exePath: z.string(),
  exeArgs: z.string(),
});

export type EditorConfig = z.infer<typeof EditorConfigSchema>;

export type EditorInfo = {
  name: string;
  exePath: string;
  exeArgs: string;
};

export enum EditorErrorCode {
  Internal,
  ExeNotFound,
  ExeNotSet,
  ExeNotValid,
  MissingParameters,
}

export type EditorErrorCodes = {
  Exec:
    | EditorErrorCodes["List"]
    | EditorErrorCode.Internal
    | EditorErrorCode.ExeNotFound
    | EditorErrorCode.ExeNotSet
    | EditorErrorCode.ExeNotValid;
  List: ConfigurableErrorCodes["LoadConfig"];
  Set:
    | ConfigurableErrorCodes["LoadConfig"]
    | EditorErrorCode.MissingParameters
    | EditorErrorCode.ExeNotFound
    | EditorErrorCode.ExeNotValid;
};

export default abstract class Editor extends Configurable<EditorConfig> {
  protected ConfigSchema = EditorConfigSchema;
  protected defaultConfig = { exePath: "", exeArgs: "%1" };

  abstract displayName: string;

  protected async exec(
    ...args: string[]
  ): Promise<Result<ShellOutput, EditorErrorCodes["Exec"]>> {
    const scope = this.scope("exec");

    const infoResult = await this.list();
    if (R.isError(infoResult)) {
      return infoResult;
    }

    this.logger.start("Checking if an editor executable has been set");
    const info = infoResult.data;
    if (!info.exePath) {
      this.logger.failure();
      const message = "No executable set";
      return R.Error(scope, message, EditorErrorCode.ExeNotSet);
    }
    this.logger.success();

    this.logger.start("Checking if editor executable exists");
    const exePathExists = await this.fs.exists(info.exePath);
    if (!exePathExists) {
      this.logger.failure();
      const message = `The editor executable "${info.exePath}" was not found`;
      return R.Error(scope, message, EditorErrorCode.ExeNotFound);
    }
    this.logger.success();

    this.logger.start("Checking if the editor executable is valid");
    const exePathIsValid = await this.fs.isFile(info.exePath);
    if (!exePathIsValid) {
      this.logger.failure();
      const message = `Editor executable "${info.exePath}" is not valid`;
      return R.Error(scope, message, EditorErrorCode.ExeNotValid);
    }
    this.logger.success();

    let command = `"${info.exePath}" ${info.exeArgs}`;
    for (const [i, arg] of args.entries()) {
      command = command.replace(new RegExp(`%${i + 1}`, "g"), `"${arg}"`);
    }

    this.logger.start(`Executing editor command`);
    this.logger.log(`$ ${command}`);
    const execResult = await this.fs.exec(command);
    if (R.isError(execResult)) {
      this.logger.failure();
      const message = `Failed to execute editor command \`${command}\``;
      return R.Stack(execResult, scope, message, EditorErrorCode.Internal);
    }
    this.logger.success();

    return R.Ok(execResult.data);
  }

  async list(): Promise<Result<EditorInfo, EditorErrorCodes["List"]>> {
    this.logger.start("Loading editor config");
    const configResult = await this.loadConfig();
    if (R.isError(configResult)) {
      this.logger.failure();
      return configResult;
    }
    this.logger.success();

    const config = configResult.data;
    const editor = {
      name: this.displayName,
      exePath: config.exePath,
      exeArgs: config.exeArgs,
    };

    return R.Ok(editor);
  }

  async set(
    partialEditorConfig: Partial<EditorConfig>,
  ): Promise<ResultVoid<EditorErrorCodes["Set"]>> {
    const scope = this.scope("set");

    if (
      partialEditorConfig.exePath === undefined &&
      partialEditorConfig.exeArgs === undefined
    ) {
      const message = "There are no parameters to change";
      return R.Error(scope, message, EditorErrorCode.MissingParameters);
    }

    this.logger.start("Loading editor config");
    const configResult = await this.loadConfig();
    if (R.isError(configResult)) {
      this.logger.failure();
      return configResult;
    }
    this.logger.success();

    const config = configResult.data;

    if (partialEditorConfig.exePath !== undefined) {
      if (partialEditorConfig.exePath !== "") {
        this.logger.start("Checking if given executable exists");
        const exePathExists = await this.fs.exists(partialEditorConfig.exePath);
        if (!exePathExists) {
          this.logger.failure();
          const message = `The given executable "${partialEditorConfig.exePath}" does not exist`;
          return R.Error(scope, message, EditorErrorCode.ExeNotFound);
        }
        this.logger.success();

        this.logger.start("Checking if given executable is valid");
        const exePathIsFile = await this.fs.isFile(partialEditorConfig.exePath);
        if (!exePathIsFile) {
          this.logger.failure();
          const message = `The given executable "${partialEditorConfig.exePath}" is not valid`;
          return R.Error(scope, message, EditorErrorCode.ExeNotValid);
        }
        this.logger.success();
      }

      config.exePath = partialEditorConfig.exePath;
    }

    if (partialEditorConfig.exeArgs !== undefined) {
      this.logger.start("Setting exe args");
      config.exeArgs =
        partialEditorConfig.exeArgs === ""
          ? config.exeArgs
          : partialEditorConfig.exeArgs;
      this.logger.success();
    }

    this.logger.start("Saving config");
    const result = await this.saveConfig(config);
    if (R.isError(result)) {
      this.logger.failure();
      return result;
    }
    this.logger.success();

    return R.Void;
  }
}
