import { z } from "zod";

export const EditorConfigSchema = z.object({
  exePath: z.string(),
  exeArgs: z.string(),
});

export type EditorConfig = z.infer<typeof EditorConfigSchema>;

export type Editor = {
  name: string;
  displayName: string;
  config: EditorConfig;
};
