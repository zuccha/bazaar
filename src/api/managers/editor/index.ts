import Configurable from "../configurable";
import { R, Result, ResultVoid } from "../../utils/result";
import SupportedEditor, {
  SupportedEditorName,
  SupportedEditors,
} from "./supported-editor";
import { Editor, EditorConfig } from "./editor";
import {
  EditorManagerConfig,
  EditorManagerConfigSchema,
} from "./editor-manager-config";

export default class EditorManager extends Configurable<EditorManagerConfig> {
  static ErrorCode = {
    ...Configurable.ErrorCode,
    ExeFileNotFound: "EditorManager.ExeFileNotFound",
    MissingParameters: "EditorManager.MissingParameters",
    Generic: "EditorManager.Generic",
  };

  protected id = "editor";
  protected ConfigSchema = EditorManagerConfigSchema;
  protected defaultConfig = {
    "code-editor": SupportedEditor["code-editor"].config,
    emulator: SupportedEditor.emulator.config,
  };

  static EditorNames: SupportedEditorName[] = Object.keys(
    SupportedEditor,
  ) as SupportedEditorName[];

  async listAll(): Promise<Result<Editor[]>> {
    this.logger.start("Loading config");
    const configResult = await this.loadConfig();
    if (R.isError(configResult)) {
      return configResult;
    }
    this.logger.success();

    const config = configResult.data;
    const editors = SupportedEditors.map((editor) => ({
      ...editor,
      config: config[editor.name],
    }));

    return R.Ok(editors);
  }

  async list(editorName: SupportedEditorName): Promise<Result<Editor>> {
    this.logger.start("Loading config");
    const configResult = await this.loadConfig();
    if (R.isError(configResult)) {
      this.logger.failure();
      return configResult;
    }
    this.logger.success();

    const config = configResult.data;
    const editor = {
      ...SupportedEditor[editorName],
      config: config[editorName],
    };

    return R.Ok(editor);
  }

  async set(
    editorName: SupportedEditorName,
    partialEditorConfig: Partial<EditorConfig>,
  ): Promise<ResultVoid> {
    const scope = this.scope("set");

    if (
      partialEditorConfig.exePath === undefined &&
      partialEditorConfig.exeArgs === undefined
    ) {
      const message = "There are no parameters to change";
      return R.Error(scope, message, EditorManager.ErrorCode.MissingParameters);
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
        return R.Error(scope, message, EditorManager.ErrorCode.ExeFileNotFound);
      }

      config[editorName].exePath = partialEditorConfig.exePath;
      this.logger.success();
    }

    if (partialEditorConfig.exeArgs !== undefined) {
      this.logger.start("Setting exe args");
      config[editorName].exeArgs =
        partialEditorConfig.exeArgs === ""
          ? SupportedEditor[editorName].config.exeArgs
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
