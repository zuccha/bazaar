import { z } from "zod";

export const EditorConfigSchema = z.object({
  exePath: z.string(),
  exeArgs: z.string(),
});

export type EditorConfig = z.infer<typeof EditorConfigSchema>;

export type EditorInfo = {
  name: string;
  displayName: string;
  defaultExeArgs: string;
};

export type Editor = {
  info: EditorInfo;
  config: EditorConfig;
};
