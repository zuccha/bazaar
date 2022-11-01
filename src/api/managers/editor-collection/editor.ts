import { z } from "zod";
import ConfigManager from "../../utils/config-manager";
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

const ErrorCode = {
  ...ConfigManager.ErrorCode,
  ExeNotFound: "Editor.ExeNotFound",
  MissingParameters: "Editor.MissingParameters",
  Generic: "Editor.Generic",
};

export default abstract class Editor extends ConfigManager<EditorConfig> {
  static ErrorCode = ErrorCode;

  protected ConfigSchema = EditorConfigSchema;
  protected defaultConfig = { exePath: "", exeArgs: "%1" };

  protected abstract displayName: string;

  async list(): Promise<Result<EditorInfo>> {
    const configResult = await this.loadConfig();
    if (R.isError(configResult)) {
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

  async set(partialEditorConfig: Partial<EditorConfig>): Promise<ResultVoid> {
    const scope = this.scope("set");

    if (
      partialEditorConfig.exePath === undefined &&
      partialEditorConfig.exeArgs === undefined
    ) {
      const message = "There are no parameters to change";
      return R.Error(scope, message, ErrorCode.MissingParameters);
    }

    this.logger.start("Loading config");
    const configResult = await this.loadConfig();
    if (R.isError(configResult)) {
      this.logger.failure();
      return configResult;
    }

    const config = configResult.data;
    this.logger.success();

    if (partialEditorConfig.exePath !== undefined) {
      this.logger.start("Setting exe path");
      const exePathExists = await this.fs.exists(partialEditorConfig.exePath);
      if (!exePathExists && partialEditorConfig.exePath !== "") {
        this.logger.failure();
        const message = `The given executable "${partialEditorConfig.exePath}" does not exist`;
        return R.Error(scope, message, ErrorCode.ExeNotFound);
      }

      config.exePath = partialEditorConfig.exePath;
      this.logger.success();
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
