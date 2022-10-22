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

export enum FSError {
  DirectoryAlreadyExists,
  DirectoryNotFound,
  FailedToUnzip,
  FailedToZip,
  FileAlreadyExists,
  FileNotFound,
  NotDirectory,
  NotFile,
  Generic,
}

export type CopyDirectoryOptions = { force: boolean };
export type CopyFileOptions = { force: boolean };
export type RenameDirectoryOptions = { force: boolean };
export type RenameFileOptions = { force: boolean };
export type RemoveDirectoryOptions = { silent: boolean };
export type RemoveFileOptions = { silent: boolean };
export type DownloadFileOptions = { force: boolean };
export type ZipDirectoryOptions = { force: boolean };
export type UnzipFileOptions = {
  force: boolean;
  collapseSingleDirectoryArchive: boolean;
};

export const defaultCopyDirectoryOptions: CopyDirectoryOptions = {
  force: false,
};
export const defaultCopyFileOptions: CopyFileOptions = { force: false };
export const defaultRenameDirectoryOptions: RenameDirectoryOptions = {
  force: false,
};
export const defaultRenameFileOptions: RenameFileOptions = { force: false };
export const defaultRemoveDirectoryOptions: RemoveDirectoryOptions = {
  silent: false,
};
export const defaultRemoveFileOptions: RemoveFileOptions = { silent: false };
export const defaultDownloadFileOptions: DownloadFileOptions = { force: false };
export const defaultZipDirectoryOptions: ZipDirectoryOptions = { force: false };
export const defaultUnzipFileOptions: UnzipFileOptions = {
  force: false,
  collapseSingleDirectoryArchive: false,
};

export type FS = {
  createDirectory: (directoryPath: string) => Promise<ResultVoid>;

  copyDirectory: (
    sourceDirectoryPath: string,
    targetDirectoryPath: string,
    options?: Partial<CopyDirectoryOptions>,
  ) => Promise<ResultVoid>;
  copyFile: (
    sourceFilePath: string,
    targetFilePath: string,
    options?: Partial<CopyFileOptions>,
  ) => Promise<ResultVoid>;

  renameDirectory: (
    sourceDirectoryPath: string,
    targetDirectoryPath: string,
    options?: Partial<RenameDirectoryOptions>,
  ) => Promise<ResultVoid>;
  renameFile: (
    sourceFilePath: string,
    targetFilePath: string,
    options?: Partial<RenameFileOptions>,
  ) => Promise<ResultVoid>;

  removeDirectory: (
    directoryPath: string,
    options?: Partial<RemoveDirectoryOptions>,
  ) => Promise<ResultVoid>;
  removeFile: (
    filePath: string,
    options?: Partial<RemoveFileOptions>,
  ) => Promise<ResultVoid>;

  exists: (path: string) => Promise<boolean>;
  isDirectory: (directoryPath: string) => Promise<boolean>;
  isFile: (filePath: string) => Promise<boolean>;

  readFile: (filePath: string) => Promise<Result<string>>;

  getDirectoryInfo: (directoryPath: string) => Promise<Result<DirectoryInfo>>;
  getFileInfo: (filePath: string) => Promise<Result<FileInfo>>;

  join: (...paths: string[]) => string;

  getDirectoryPath: (path: string) => string;
  getName: (path: string) => string;
  getExtension: (path: string) => string;

  downloadFile: (
    filePath: string,
    url: string,
    options?: Partial<DownloadFileOptions>,
  ) => Promise<ResultVoid>;

  zipDirectory: (
    directoryPath: string,
    targetZipFilePath: string,
    options?: Partial<ZipDirectoryOptions>,
  ) => Promise<ResultVoid>;
  unzipFile: (
    zipFilePath: string,
    targetDirectoryPath: string,
    options?: Partial<UnzipFileOptions>,
  ) => Promise<ResultVoid>;
};
