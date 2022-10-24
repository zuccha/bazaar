const SupportedEditorInfo = {
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

export default SupportedEditorInfo;

export const SupportedEditorInfos = Object.values(SupportedEditorInfo);

export type SupportedEditorName = keyof typeof SupportedEditorInfo;
