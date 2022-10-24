import ConfigManager from "../../utils/config-manager";
import { R, Result, ResultVoid } from "../../utils/result";
import SupportedEditorInfo, {
  SupportedEditorName,
  SupportedEditorInfos,
} from "./supported-editor-info";
import { Editor, EditorConfig } from "./editor";
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
    SupportedEditorInfo,
  ) as SupportedEditorName[];

  async listAll(): Promise<Result<Editor[]>> {
    this.log("Loading config...");
    const configResult = await this.loadConfig();
    if (R.isError(configResult)) {
      return configResult;
    }
    this.log("Config loaded");

    const config = configResult.data;
    const editors = SupportedEditorInfos.map((editorInfo) => ({
      info: SupportedEditorInfo[editorInfo.name],
      config: config[editorInfo.name],
    }));

    return R.Ok(editors);
  }

  async list(editorName: SupportedEditorName): Promise<Result<Editor>> {
    this.log("Loading config...");
    const configResult = await this.loadConfig();
    if (R.isError(configResult)) {
      return configResult;
    }
    this.log("Config loaded");

    const config = configResult.data;
    const editor = {
      info: SupportedEditorInfo[editorName],
      config: config[editorName],
    };

    return R.Ok(editor);
  }

  async set(
    editorName: SupportedEditorName,
    partialConfig: Partial<EditorConfig>,
  ): Promise<ResultVoid> {
    const scope = this.scope("set");
    const editorInfo = SupportedEditorInfo[editorName];

    if (
      partialConfig.exePath === undefined &&
      partialConfig.exeArgs === undefined
    ) {
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

    if (partialConfig.exePath !== undefined) {
      this.log("Setting exe path...");
      const exePathExists = await this.fs.exists(partialConfig.exePath);
      if (!exePathExists && partialConfig.exePath !== "") {
        const message = `The given executable "${partialConfig.exePath}" does not exist`;
        return R.Error(scope, message, EditorManager.ErrorCode.ExeFileNotFound);
      }

      config[editorName].exePath = partialConfig.exePath;
      this.log(`exe path set to "${config[editorName].exePath}"`);
    }

    if (partialConfig.exeArgs !== undefined) {
      this.log("Setting exe args...");
      config[editorName].exeArgs =
        partialConfig.exeArgs === ""
          ? editorInfo.defaultExeArgs
          : partialConfig.exeArgs;
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
