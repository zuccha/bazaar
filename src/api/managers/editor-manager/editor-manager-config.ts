import { z } from "zod";
import { EditorConfigSchema } from "./editor";

export const EditorManagerConfigSchema = z.object({
  "code-editor": EditorConfigSchema,
  emulator: EditorConfigSchema,
});

export type EditorManagerConfig = z.infer<typeof EditorManagerConfigSchema>;
