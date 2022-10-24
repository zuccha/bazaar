import { z } from "zod";
import { EditorConfigSchema } from "./editor";

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
