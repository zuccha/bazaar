import { Result } from "./result";

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

export enum FSError {
  DirectoryAlreadyExists,
  DirectoryNotFound,
  FileAlreadyExists,
  FileNotFound,
  NotDirectory,
  NotFile,
  Generic,
}

export type FS = {
  createDirectory: (directoryPath: string) => Promise<Result<void>>;

  copyDirectory: (
    sourceDirectoryPath: string,
    targetDirectoryPath: string,
    options: { force: boolean },
  ) => Promise<Result<void>>;
  copyFile: (
    sourceFilePath: string,
    targetFilePath: string,
    options: { force: boolean },
  ) => Promise<Result<void>>;

  renameDirectory: (
    sourceDirectoryPath: string,
    targetDirectoryPath: string,
    options: { force: boolean },
  ) => Promise<Result<void>>;
  renameFile: (
    sourceFilePath: string,
    targetFilePath: string,
    options: { force: boolean },
  ) => Promise<Result<void>>;

  removeDirectory: (directoryPath: string) => Promise<Result<void>>;
  removeFile: (filePath: string) => Promise<Result<void>>;

  exists: (path: string) => Promise<Result<boolean>>;
  isDirectory: (directoryPath: string) => Promise<Result<boolean>>;
  isFile: (filePath: string) => Promise<Result<boolean>>;

  readFile: (filePath: string) => Promise<Result<string>>;

  getDirectoryInfo: (directoryPath: string) => Promise<Result<DirectoryInfo>>;
  getFileInfo: (filePath: string) => Promise<Result<FileInfo>>;

  join: (...paths: string[]) => string;

  getDirectoryPath: (path: string) => string;
  getName: (path: string) => string;
  getExtension: (path: string) => string;
};
