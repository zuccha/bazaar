import { Flags } from "@oclif/core";
import FSNode from "../utils/fs-node";

export const ProjectFlags = {
  path: Flags.string({
    summary: "Project directory",
    description: "By default it will be the current working directory.",
    default: FSNode.resolve("."),
    required: false,
    parse: async (path: string): Promise<string> => FSNode.resolve(path),
  }),
};

export const ProjectCreationFlags = {
  name: Flags.string({
    summary: "Name of the project",
    description:
      "The name will be used to create a directory inside the chosen <path>.",
    required: true,
  }),
  path: Flags.string({
    summary: "Directory where the project will be created",
    description: `The project folder will be "<path>\\<name>".`,
    default: FSNode.resolve("."),
    required: false,
    parse: async (path: string): Promise<string> => FSNode.resolve(path),
  }),
};

export const ProjectConfigFlags = {
  author: Flags.string({
    summary: "Author(s) of the hack",
    description: "You can specify this flag several times to add more authors.",
    multiple: true,
    required: false,
  }),
  version: Flags.string({
    summary: "Version of the project",
    description:
      "The version can be anything, but a suggested format is SemVer.",
    required: false,
  }),
};

export const ProjectTemplateFlags = {
  name: Flags.string({
    summary: "Name of the template",
    description: "The name is unique for each project template.",
    required: true,
  }),
};
