import { R, ResultVoid } from "../../../utils/result";
import Editor, { EditorErrorCodes } from "../editor";

export enum CodeEditorErrorCode {
  Internal,
  PathNotFound,
}

export type CodeEditorErrorCodes = {
  Open:
    | EditorErrorCodes["Exec"]
    | CodeEditorErrorCode.Internal
    | CodeEditorErrorCode.PathNotFound;
};

export default class CodeEditor extends Editor {
  protected id = "CodeEditor";

  protected configName = "_code-editor.json";
  displayName = "Code Editor";

  async open(path: string): Promise<ResultVoid<CodeEditorErrorCodes["Open"]>> {
    const scope = this.scope("open");

    path = this.fs.resolve(path);

    this.logger.start(`Checking if path to open exists`);
    const pathExists = await this.fs.exists(path);
    if (!pathExists) {
      this.logger.failure();
      const message = `Path "${path}" does not exist`;
      return R.Error(scope, message, CodeEditorErrorCode.PathNotFound);
    }
    this.logger.success();

    this.logger.start(`Executing code editor command`);
    const execResult = await this.exec(path);
    if (R.isError(execResult)) {
      this.logger.failure();
      return execResult;
    }
    this.logger.success();

    if (execResult.data.stderr) {
      const message = `Failed to open "${path}"`;
      return R.Stack(
        R.Error(scope, execResult.data.stderr, CodeEditorErrorCode.Internal),
        scope,
        message,
        CodeEditorErrorCode.Internal,
      );
    }

    return R.Void;
  }
}
