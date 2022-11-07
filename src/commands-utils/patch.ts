import {
  PatchErrorCode,
  PatchErrorCodes,
} from "../api/managers/project/patch-collection/patch";
import {
  getValidateResourceErrorMessage,
  isValidateResourceErrorCode,
  ResourceConfigFlags,
  ResourceFlags,
} from "./resource";

const patchLabel = { singular: "patch", plural: "patches" };
export const PatchFlags = ResourceFlags(patchLabel);
export const PatchConfigFlags = ResourceConfigFlags(patchLabel);

export const isValidatePatchErrorCode = (
  errorCode: unknown,
): errorCode is Exclude<PatchErrorCodes["Validate"], 0> => {
  return (
    isValidateResourceErrorCode(errorCode) ||
    errorCode === PatchErrorCode.CodeDirectoryNotFound ||
    errorCode === PatchErrorCode.CodeDirectoryNotValid ||
    errorCode === PatchErrorCode.MainFileNotFound ||
    errorCode === PatchErrorCode.MainFileNotValid ||
    errorCode === PatchErrorCode.MainFileNotAsm
  );
};

export const getValidatePatchErrorMessage = (
  errorCode: Exclude<PatchErrorCodes["Validate"], 0>,
  path: string,
  type = "patch",
): string => {
  if (isValidateResourceErrorCode(errorCode)) {
    return getValidateResourceErrorMessage(errorCode, path, type);
  }

  switch (errorCode) {
    case PatchErrorCode.CodeDirectoryNotFound:
      return `The ${type} code directory doesn't exist`;
    case PatchErrorCode.CodeDirectoryNotValid:
      return `The ${type} code directory is not valid`;
    case PatchErrorCode.MainFileNotFound:
      return `The ${type} main file was not found`;
    case PatchErrorCode.MainFileNotValid:
      return `The ${type} main file is not valid`;
    case PatchErrorCode.MainFileNotAsm:
      return `The ${type} main file doesn't have ".asm" extension`;
  }
};
