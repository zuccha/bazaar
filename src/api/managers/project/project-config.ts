import { z } from "zod";

export const ProjectConfigSchema = z.object({
  authors: z.array(z.string()),
  version: z.string(),
});

export type ProjectConfig = z.infer<typeof ProjectConfigSchema>;
