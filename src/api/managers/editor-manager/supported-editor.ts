const SupportedEditor = {
  "code-editor": {
    name: "code-editor",
    displayName: "Code editor",
    defaultExeArgs: "%1%",
  },
  emulator: {
    name: "emulator",
    displayName: "Emulator",
    defaultExeArgs: "%1%",
  },
} as const;

export type SupportedEditorName = keyof typeof SupportedEditor;

export const SupportedEditors = Object.values(SupportedEditor);

export default SupportedEditor;
