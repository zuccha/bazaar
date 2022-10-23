import { z } from "zod";

const EditorConfigSchema = z.object({
  exePath: z.string(),
  exeArgs: z.string(),
});

export const EditorManagerConfigSchema = z.object({
  "code-editor": EditorConfigSchema,
  emulator: EditorConfigSchema,
});

export type EditorManagerConfig = z.infer<typeof EditorManagerConfigSchema>;

export const defaultEditorManagerConfig: EditorManagerConfig = {
  "code-editor": {
    exePath: "",
    exeArgs: "%1%",
  },
  emulator: {
    exePath: "",
    exeArgs: "%1%",
  },
};
