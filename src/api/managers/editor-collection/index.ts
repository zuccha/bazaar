import DirectoryManager, { ManagerBag } from "../../utils/directory-manager";
import { R, Result } from "../../utils/result";
import Editor, { EditorInfo } from "./editor";
import CodeEditor from "./editors/code-editor";
import Emulator from "./editors/emulator";

const ErrorCode = {
  Generic: "EditorCollection.Generic",
};

export default class EditorCollection extends DirectoryManager {
  static ErrorCode = ErrorCode;

  protected id = "editor-collection";

  CodeEditor: CodeEditor;
  Emulator: Emulator;

  private _editors: Editor[];

  constructor(directoryPath: string, managerBag: ManagerBag) {
    super(directoryPath, managerBag);

    this.CodeEditor = new CodeEditor(directoryPath, managerBag);
    this.Emulator = new Emulator(directoryPath, managerBag);

    this._editors = [this.CodeEditor, this.Emulator];
  }

  async listAll(): Promise<Result<EditorInfo[]>> {
    const scope = this.scope("listAll");

    const editorInfos: EditorInfo[] = [];

    for (const editor of this._editors) {
      const editorResult = await editor.list();

      if (R.isError(editorResult)) {
        const message = "Failed to gather data for editor";
        return R.Stack(editorResult, scope, message, ErrorCode.Generic);
      }

      editorInfos.push(editorResult.data);
    }

    return R.Ok(editorInfos);
  }
}
