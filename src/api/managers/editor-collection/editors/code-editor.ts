import { R, ResultVoid } from "../../../utils/result";
import Editor from "../editor";

const ErrorCode = {
  ...Editor.ErrorCode,
  FailedToOpenPath: "CodeEditor.FailedToOpenPath",
  PathNotFound: "CodeEditor.PathNotFound",
};

export default class CodeEditor extends Editor {
  static ErrorCode = ErrorCode;

  protected id = "CodeEditor";

  protected configName = "_code-editor.json";
  protected displayName = "Code Editor";

  async open(path: string): Promise<ResultVoid> {
    const scope = this.scope("open");

    path = this.fs.resolve(path);

    this.logger.start(`Checking if path "${path}" exists`);
    const pathExists = await this.fs.exists(path);
    if (!pathExists) {
      this.logger.failure();
      const message = `Path "${path}" does not exist`;
      return R.Error(scope, message, ErrorCode.PathNotFound);
    }
    this.logger.success();

    const execResult = await this.exec(path);
    if (R.isError(execResult)) {
      return execResult;
    }

    if (execResult.data.stderr) {
      const message = `Failed to open "${path}"`;
      return R.Stack(
        R.Error(scope, execResult.data.stderr, ErrorCode.Generic),
        scope,
        message,
        ErrorCode.FailedToOpenPath,
      );
    }

    return R.Void;
  }
}
