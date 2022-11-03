import { R, Result } from "../../utils/result";
import Directory, { DirectoryBag } from "../directory";
import Editor, { EditorInfo } from "./editor";
import CodeEditor from "./editors/code-editor";
import Emulator from "./editors/emulator";

const ErrorCode = {
  Generic: "EditorCollection.Generic",
};

export default class EditorCollection extends Directory {
  static ErrorCode = ErrorCode;

  protected id = "EditorCollection";

  CodeEditor: CodeEditor;
  Emulator: Emulator;

  private _editors: Editor[];

  constructor(directoryPath: string, bag: DirectoryBag) {
    super(directoryPath, bag);

    this.CodeEditor = new CodeEditor(directoryPath, bag);
    this.Emulator = new Emulator(directoryPath, bag);

    this._editors = [this.CodeEditor, this.Emulator];
  }

  async listAll(): Promise<Result<EditorInfo[]>> {
    const scope = this.scope("listAll");

    const editorInfos: EditorInfo[] = [];

    for (const editor of this._editors) {
      this.logger.start(`Gathering ${editor.displayName} info`);
      const editorResult = await editor.list();
      if (R.isError(editorResult)) {
        this.logger.failure();
        const message = "Failed to gather data for editor";
        return R.Stack(editorResult, scope, message, ErrorCode.Generic);
      }
      this.logger.success();

      editorInfos.push(editorResult.data);
    }

    return R.Ok(editorInfos);
  }
}
