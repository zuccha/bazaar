import EditorCollection from "../api/managers/editor-collection";
import Editor, {
  EditorErrorCode,
} from "../api/managers/editor-collection/editor";
import { CodeEditorErrorCode } from "../api/managers/editor-collection/editors/code-editor";

export enum EditorName {
  CodeEditor = "code-editor",
  Emulator = "emulator",
}

export const getEditor = (
  tools: EditorCollection,
  toolName: EditorName,
): Editor => {
  switch (toolName) {
    case EditorName.CodeEditor:
      return tools.CodeEditor;
    case EditorName.Emulator:
      return tools.Emulator;
  }
};

type ExecuteCodeEditorErrorCode =
  | CodeEditorErrorCode.PathNotFound
  | EditorErrorCode.ExeNotSet
  | EditorErrorCode.ExeNotFound
  | EditorErrorCode.ExeNotValid;

export const isExecuteCodeEditorErrorCode = (
  errorCode: unknown,
): errorCode is ExecuteCodeEditorErrorCode => {
  return (
    errorCode === CodeEditorErrorCode.PathNotFound ||
    errorCode === EditorErrorCode.ExeNotSet ||
    errorCode === EditorErrorCode.ExeNotFound ||
    errorCode === EditorErrorCode.ExeNotValid
  );
};

export const getExecuteCodeEditorErrorMessage = (
  errorCode: ExecuteCodeEditorErrorCode,
  path: string,
): string => {
  switch (errorCode) {
    case CodeEditorErrorCode.PathNotFound:
      return `The path "${path}" does not exist`;
    case EditorErrorCode.ExeNotSet:
      return `The code editor is not configured`;
    case EditorErrorCode.ExeNotFound:
      return `The configured code editor does not exist`;
    case EditorErrorCode.ExeNotValid:
      return `The configured code editor is not valid`;
  }
};
