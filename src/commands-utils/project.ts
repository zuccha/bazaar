import { Flags } from "@oclif/core";
import { ProjectErrorCode, ProjectErrorCodes } from "../api/managers/project";
import FSNode from "../utils/fs-node";
import {
  getValidateResourceErrorMessage,
  isValidateResourceErrorCode,
  ResourceConfigFlags,
  ResourceFlags,
} from "./resource";

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

export const ProjectConfigFlags = ResourceConfigFlags({
  singular: "project",
  plural: "projects",
});

export const ProjectTemplateFlags = ResourceFlags({
  singular: "project template",
  plural: "project templates",
});

export const isValidateProjectErrorCode = (
  errorCode: unknown,
): errorCode is ProjectErrorCodes["Validate"] => {
  return (
    isValidateResourceErrorCode(errorCode) ||
    errorCode === ProjectErrorCode.BaseromNotFound ||
    errorCode === ProjectErrorCode.BaseromNotValid
  );
};

export const getValidateProjectErrorMessage = (
  errorCode: ProjectErrorCodes["Validate"],
  path: string,
  type = "project",
): string => {
  if (isValidateResourceErrorCode(errorCode)) {
    return getValidateResourceErrorMessage(errorCode, path, type);
  }

  switch (errorCode) {
    case ProjectErrorCode.BaseromNotFound:
      return `The ${type} "${path}" is not valid, no baserom was found`;
    case ProjectErrorCode.BaseromNotValid:
      return `The ${type} "${path}" is not valid, the baserom is not valid`;
  }
};
