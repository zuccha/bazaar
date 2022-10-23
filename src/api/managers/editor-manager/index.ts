import ConfigManager from "../../utils/config-manager";
import { R, Result } from "../../utils/result";
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

  // async set(
  //   editorName: SupportedEditorName,
  //   properties: {
  //     exePath?: string;
  //     exeArgs?: string;
  //   },
  // ): Promise<ResultVoid> {
  //   return R.Void;
  // }
}
