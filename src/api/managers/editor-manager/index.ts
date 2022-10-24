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
    this.log("Loading config...");
    const configResult = await this.loadConfig();
    if (R.isError(configResult)) {
      return configResult;
    }
    this.log("Config loaded");

    const config = configResult.data;
    const editorInfos = SupportedEditors.map((editor) => ({
      editor: SupportedEditor[editor.name],
      exePath: config[editor.name].exePath,
      exeArgs: config[editor.name].exeArgs,
    }));

    return R.Ok(editorInfos);
  }

  async list(editorName: SupportedEditorName): Promise<Result<EditorInfo>> {
    this.log("Loading config...");
    const configResult = await this.loadConfig();
    if (R.isError(configResult)) {
      return configResult;
    }
    this.log("Config loaded");

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

    this.log("Loading config...");
    const configResult = await this.loadConfig();
    if (R.isError(configResult)) {
      return configResult;
    }
    const config = configResult.data;
    this.log("Config loaded");

    if (properties.exePath !== undefined) {
      this.log("Setting exe path...");
      const exePathExists = await this.fs.exists(properties.exePath);
      if (!exePathExists && properties.exePath !== "") {
        const message = `The given executable "${properties.exePath}" does not exist`;
        return R.Error(scope, message, EditorManager.ErrorCode.ExeFileNotFound);
      }

      config[editorName].exePath = properties.exePath;
      this.log(`exe path set to "${config[editorName].exePath}"`);
    }

    if (properties.exeArgs !== undefined) {
      this.log("Setting exe args...");
      config[editorName].exeArgs =
        properties.exeArgs === "" ? editor.defaultExeArgs : properties.exeArgs;
      this.log(`exe args set to "${config[editorName].exeArgs}"`);
    }

    this.log("Saving config...");
    const result = await this.saveConfig(config);
    if (R.isError(result)) {
      return result;
    }
    this.log("Config saved");

    return R.Void;
  }
}
