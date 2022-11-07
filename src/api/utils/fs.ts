import { Result, ResultVoid } from "./result";

export type DirectoryInfo = {
  path: string;
  name: string;
  directoryNames: string[];
  fileNames: string[];
};

export type FileInfo = {
  path: string;
  name: string;
  extension: string;
};

export type ShellOutput = {
  stdout: string;
  stderr: string;
};

export enum FSErrorCode {
  Internal,
  DirectoryAlreadyExists,
  DirectoryNotFound,
  DirectoryNotValid,
  FileAlreadyExists,
  FileNotFound,
  FileNotValid,
}

export namespace CreateDirectory {
  export type ErrorCode =
    | FSErrorCode.Internal
    | FSErrorCode.DirectoryAlreadyExists;

  export type Fn = (directoryPath: string) => Promise<ResultVoid<ErrorCode>>;
}

export namespace CopyDirectory {
  export type Options = { force: boolean };

  export const defaultOptions: Options = {
    force: false,
  };

  export type ErrorCode =
    | FSErrorCode.Internal
    | FSErrorCode.DirectoryAlreadyExists
    | FSErrorCode.DirectoryNotFound
    | FSErrorCode.DirectoryNotValid;

  export type Fn = (
    sourceDirectoryPath: string,
    targetDirectoryPath: string,
    options?: Partial<Options>,
  ) => Promise<ResultVoid<ErrorCode>>;
}

export namespace CopyFile {
  export type Options = { force: boolean };

  export const defaultOptions: Options = { force: false };

  export type ErrorCode =
    | FSErrorCode.Internal
    | FSErrorCode.FileAlreadyExists
    | FSErrorCode.FileNotFound
    | FSErrorCode.FileNotValid;

  export type Fn = (
    sourceFilePath: string,
    targetFilePath: string,
    options?: Partial<Options>,
  ) => Promise<ResultVoid<ErrorCode>>;
}

export namespace RenameDirectory {
  export type Options = { force: boolean };

  export const defaultOptions: Options = {
    force: false,
  };

  export type ErrorCode =
    | FSErrorCode.Internal
    | FSErrorCode.DirectoryAlreadyExists
    | FSErrorCode.DirectoryNotFound
    | FSErrorCode.DirectoryNotValid;

  export type Fn = (
    sourceDirectoryPath: string,
    targetDirectoryPath: string,
    options?: Partial<Options>,
  ) => Promise<ResultVoid<ErrorCode>>;
}

export namespace RenameFile {
  export type Options = { force: boolean };

  export const defaultOptions: Options = { force: false };

  export type ErrorCode =
    | FSErrorCode.Internal
    | FSErrorCode.FileAlreadyExists
    | FSErrorCode.FileNotFound
    | FSErrorCode.FileNotValid;

  export type Fn = (
    sourceFilePath: string,
    targetFilePath: string,
    options?: Partial<Options>,
  ) => Promise<ResultVoid<ErrorCode>>;
}

export namespace RemoveDirectory {
  export type Options = { silent: boolean };

  export const defaultOptions: Options = {
    silent: false,
  };

  export type ErrorCode =
    | FSErrorCode.Internal
    | FSErrorCode.DirectoryNotFound
    | FSErrorCode.DirectoryNotValid;

  export type Fn = (
    directoryPath: string,
    options?: Partial<Options>,
  ) => Promise<ResultVoid<ErrorCode>>;
}

export namespace RemoveFile {
  export type Options = { silent: boolean };

  export const defaultOptions: Options = { silent: false };

  export type ErrorCode =
    | FSErrorCode.Internal
    | FSErrorCode.FileNotFound
    | FSErrorCode.FileNotValid;

  export type Fn = (
    filePath: string,
    options?: Partial<Options>,
  ) => Promise<ResultVoid<ErrorCode>>;
}

export namespace Exists {
  export type Fn = (path: string) => Promise<boolean>;
}

export namespace IsDirectory {
  export type Fn = (directoryPath: string) => Promise<boolean>;
}

export namespace IsFile {
  export type Fn = (filePath: string) => Promise<boolean>;
}

export namespace IsInside {
  export type Fn = (parentPath: string, childPath: string) => boolean;
}

export namespace ReadFile {
  export type ErrorCode =
    | FSErrorCode.Internal
    | FSErrorCode.FileNotFound
    | FSErrorCode.FileNotValid;

  export type Fn = (filePath: string) => Promise<Result<string, ErrorCode>>;
}

export namespace WriteFile {
  export type ErrorCode = FSErrorCode.Internal | FSErrorCode.FileNotValid;

  export type Fn = (
    filePath: string,
    content: string,
  ) => Promise<ResultVoid<ErrorCode>>;
}

export namespace GetDirectoryInfo {
  export type ErrorCode =
    | FSErrorCode.Internal
    | FSErrorCode.DirectoryNotFound
    | FSErrorCode.DirectoryNotValid;

  export type Fn = (
    directoryPath: string,
  ) => Promise<Result<DirectoryInfo, ErrorCode>>;
}

export namespace GetFileInfo {
  export type ErrorCode =
    | FSErrorCode.Internal
    | FSErrorCode.FileNotFound
    | FSErrorCode.FileNotValid;

  export type Fn = (filePath: string) => Promise<Result<FileInfo, ErrorCode>>;
}

export namespace Join {
  export type Fn = (...paths: string[]) => string;
}

export namespace Resolve {
  export type Fn = (...paths: string[]) => string;
}

export namespace GetDirectoryPath {
  export type Fn = (path: string) => string;
}

export namespace GetRelativePath {
  export type Fn = (fromPath: string, toPath: string) => string;
}

export namespace GetName {
  export type Fn = (path: string) => string;
}

export namespace GetExtension {
  export type Fn = (path: string) => string;
}

export namespace DownloadFile {
  export type Options = { force: boolean };

  export const defaultOptions: Options = {
    force: false,
  };

  export type ErrorCode = FSErrorCode.Internal | FSErrorCode.FileAlreadyExists;

  export type Fn = (
    filePath: string,
    url: string,
    options?: Partial<Options>,
  ) => Promise<ResultVoid<ErrorCode>>;
}

export namespace ZipDirectory {
  export type Options = { force: boolean };

  export const defaultOptions: Options = {
    force: false,
  };

  export type ErrorCode =
    | FSErrorCode.Internal
    | FSErrorCode.DirectoryNotFound
    | FSErrorCode.DirectoryNotValid
    | FSErrorCode.FileAlreadyExists;

  export type Fn = (
    directoryPath: string,
    targetZipFilePath: string,
    options?: Partial<Options>,
  ) => Promise<ResultVoid<ErrorCode>>;
}

export namespace UnzipFile {
  export type Options = {
    force: boolean;
    collapseSingleDirectoryArchive: boolean;
  };

  export const defaultOptions: Options = {
    force: false,
    collapseSingleDirectoryArchive: false,
  };

  export type ErrorCode =
    | FSErrorCode.Internal
    | FSErrorCode.DirectoryAlreadyExists
    | FSErrorCode.FileNotFound
    | FSErrorCode.FileNotValid;

  export type Fn = (
    zipFilePath: string,
    targetDirectoryPath: string,
    options?: Partial<Options>,
  ) => Promise<ResultVoid<ErrorCode>>;
}

export namespace Exec {
  export type ErrorCode = FSErrorCode.Internal;

  export type Fn = (command: string) => Promise<Result<ShellOutput, ErrorCode>>;
}

export type FSErrorCodes = {
  CreateDirectory: CreateDirectory.ErrorCode;

  CopyDirectory: CopyDirectory.ErrorCode;
  CopyFile: CopyFile.ErrorCode;

  RenameDirectory: RenameDirectory.ErrorCode;
  RenameFile: RenameFile.ErrorCode;

  RemoveDirectory: RemoveDirectory.ErrorCode;
  RemoveFile: RemoveFile.ErrorCode;

  Exists: never;
  IsDirectory: never;
  IsFile: never;

  ReadFile: ReadFile.ErrorCode;
  WriteFile: WriteFile.ErrorCode;

  GetDirectoryInfo: GetDirectoryInfo.ErrorCode;
  GetFileInfo: GetFileInfo.ErrorCode;

  Join: never;
  Resolve: never;

  GetDirectoryPath: never;
  GetRelativePath: never;
  GetName: never;
  GetExtension: never;

  DownloadFile: DownloadFile.ErrorCode;

  ZipDirectory: ZipDirectory.ErrorCode;
  UnzipFile: UnzipFile.ErrorCode;

  exec: Exec.Fn;
};

export type FS = {
  ErrorCode: typeof FSErrorCode;

  createDirectory: CreateDirectory.Fn;

  copyDirectory: CopyDirectory.Fn;
  copyFile: CopyFile.Fn;

  renameDirectory: RenameDirectory.Fn;
  renameFile: RenameFile.Fn;

  removeDirectory: RemoveDirectory.Fn;
  removeFile: RemoveFile.Fn;

  exists: Exists.Fn;
  isDirectory: IsDirectory.Fn;
  isFile: IsFile.Fn;
  isInside: IsInside.Fn;

  readFile: ReadFile.Fn;
  writeFile: WriteFile.Fn;

  getDirectoryInfo: GetDirectoryInfo.Fn;
  getFileInfo: GetFileInfo.Fn;

  join: Join.Fn;
  resolve: Resolve.Fn;

  getDirectoryPath: GetDirectoryPath.Fn;
  getRelativePath: GetRelativePath.Fn;
  getName: GetName.Fn;
  getExtension: GetExtension.Fn;

  downloadFile: DownloadFile.Fn;

  zipDirectory: ZipDirectory.Fn;
  unzipFile: UnzipFile.Fn;

  exec: Exec.Fn;
};
