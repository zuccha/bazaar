export type Editor = {
  name: string;
  displayName: string;
  defaultExeArgs: string;
};

export type EditorInfo = {
  editor: Editor;
  exePath: string;
  exeArgs: string;
};
