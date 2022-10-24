const SupportedEditor = {
  "code-editor": {
    name: "code-editor",
    displayName: "Code editor",

    config: {
      exePath: "",
      exeArgs: "",
    },
  },
  emulator: {
    name: "emulator",
    displayName: "Emulator",

    config: {
      exePath: "",
      exeArgs: "",
    },
  },
} as const;

export default SupportedEditor;

export const SupportedEditors = Object.values(SupportedEditor);

export type SupportedEditorName = keyof typeof SupportedEditor;
