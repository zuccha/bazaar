import { Flags } from "@oclif/core";

export const ProjectFlags = {
  path: Flags.string({
    summary: "Project directory",
    description: "By default it will be the current working directory.",
    default: ".",
    required: false,
  }),
};
