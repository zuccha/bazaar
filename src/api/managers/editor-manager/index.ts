import ConfigManager from "../../utils/config-manager";
import { R, Result, ResultVoid } from "../../utils/result";
import SupportedEditor, {
  SupportedEditorName,
  SupportedEditors,
} from "./supported-editor";
import { EditorInfo } from "./editor-info";
import {
  defaultEditorManagerConfig,
  EditorManagerConfig,
  EditorManagerConfigSchema,
} from "./editor-manager-config";

export default class EditorManager extends ConfigManager<EditorManagerConfig> {
  static ErrorCode = {
    ...ConfigManager.ErrorCode,
    ExeFileNotFound: "EditorManager.ExeFileNotFound",
    MissingParameters: "EditorManager.MissingParameters",
    Generic: "EditorManager.Generic",
  };

  protected id = "editor";
  protected directoryName = "Editor";
  protected ConfigSchema = EditorManagerConfigSchema;
  protected defaultConfig = defaultEditorManagerConfig;

  static EditorNames: SupportedEditorName[] = Object.keys(
    SupportedEditor,
  ) as SupportedEditorName[];

  async listAll(): Promise<Result<EditorInfo[]>> {
    const configResult = await this.loadConfig();
    if (R.isError(configResult)) {
      return configResult;
    }

    const config = configResult.data;
    const editorInfos = SupportedEditors.map((editor) => ({
      editor: SupportedEditor[editor.name],
      exePath: config[editor.name].exePath,
      exeArgs: config[editor.name].exeArgs,
    }));

    return R.Ok(editorInfos);
  }

  async list(editorName: SupportedEditorName): Promise<Result<EditorInfo>> {
    const configResult = await this.loadConfig();
    if (R.isError(configResult)) {
      return configResult;
    }

    const config = configResult.data;
    const editorInfo = {
      editor: SupportedEditor[editorName],
      exePath: config[editorName].exePath,
      exeArgs: config[editorName].exeArgs,
    };

    return R.Ok(editorInfo);
  }

  async set(
    editorName: SupportedEditorName,
    properties: {
      exePath?: string;
      exeArgs?: string;
    },
  ): Promise<ResultVoid> {
    const scope = this.scope("set");
    const editor = SupportedEditor[editorName];

    if (properties.exePath === undefined && properties.exeArgs === undefined) {
      const message = "There are no parameters to change";
      return R.Error(scope, message, EditorManager.ErrorCode.MissingParameters);
    }

    const configResult = await this.loadConfig();
    if (R.isError(configResult)) {
      return configResult;
    }

    const config = configResult.data;

    if (properties.exePath !== undefined) {
      const exePathExists = await this.fs.exists(properties.exePath);
      if (!exePathExists && properties.exePath !== "") {
        const message = `The given executable "${properties.exePath}" does not exist`;
        return R.Error(scope, message, EditorManager.ErrorCode.ExeFileNotFound);
      }

      config[editorName].exePath = properties.exePath;
    }

    if (properties.exeArgs !== undefined) {
      config[editorName].exeArgs =
        properties.exeArgs === "" ? editor.defaultExeArgs : properties.exeArgs;
    }

    const result = await this.saveConfig(config);
    if (R.isError(result)) {
      return result;
    }

    return R.Void;
  }
}
