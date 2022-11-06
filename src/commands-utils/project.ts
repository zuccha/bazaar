import { Flags } from "@oclif/core";
import { ConfigurableErrorCode } from "../api/managers/configurable";
import { ProjectErrorCode, ProjectErrorCodes } from "../api/managers/project";
import { ResourceErrorCode } from "../api/managers/resource";
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

export const isValidateProjectErrorCode = (
  errorCode: unknown,
): errorCode is ProjectErrorCodes["Validate"] => {
  return (
    errorCode === ResourceErrorCode.DirectoryNotFound ||
    errorCode === ConfigurableErrorCode.ConfigNotFound ||
    errorCode === ConfigurableErrorCode.ConfigNotValid ||
    errorCode === ProjectErrorCode.BaseromNotFound ||
    errorCode === ProjectErrorCode.BaseromNotValid
  );
};

export const getValidateProjectErrorMessage = (
  errorCode: ProjectErrorCodes["Validate"],
  path: string,
  type = "project",
): string => {
  switch (errorCode) {
    case ResourceErrorCode.DirectoryNotFound:
      return `The ${type} "${path}" does not exist`;
    case ConfigurableErrorCode.ConfigNotFound:
      return `The ${type} "${path}" is not valid, no config was found`;
    case ConfigurableErrorCode.ConfigNotValid:
      return `The ${type} "${path}" is not valid, the config is not valid`;
    case ProjectErrorCode.BaseromNotFound:
      return `The ${type} "${path}" is not valid, no baserom was found`;
    case ProjectErrorCode.BaseromNotValid:
      return `The ${type} "${path}" is not valid, the baserom is not valid`;
  }
};
