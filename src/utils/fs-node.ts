import * as NodeFSNotPromise from "node:fs";
import * as NodeFS from "node:fs/promises";
import * as NodeHTTPS from "node:https";
import * as NodePath from "node:path";
import * as AdmZip from "adm-zip";
import * as FSExtra from "fs-extra";
import {
  CopyDirectoryOptions,
  CopyFileOptions,
  defaultCopyDirectoryOptions,
  defaultCopyFileOptions,
  defaultDownloadFileOptions,
  defaultRemoveDirectoryOptions,
  defaultRemoveFileOptions,
  defaultRenameDirectoryOptions,
  defaultRenameFileOptions,
  defaultUnzipFileOptions,
  defaultZipDirectoryOptions,
  DirectoryInfo,
  DownloadFileOptions,
  FileInfo,
  FS,
  FSErrorCode,
  RemoveDirectoryOptions,
  RemoveFileOptions,
  RenameDirectoryOptions,
  RenameFileOptions,
  UnzipFileOptions,
  ZipDirectoryOptions,
} from "../api/utils/fs";
import { R, Result, ResultVoid } from "../api/utils/result";

const FSNode: FS = {
  createDirectory: async (directoryPath: string): Promise<ResultVoid> => {
    const scope = "FS.createDirectory";

    try {
      const directoryPathExists = await FSNode.exists(directoryPath);
      if (directoryPathExists) {
        const message = `Directory "${directoryPath}" already exists`;
        return R.Error(scope, message, FSErrorCode.DirectoryAlreadyExists);
      }

      await NodeFS.mkdir(directoryPath, { recursive: true });
      return R.Void;
    } catch {
      return R.Error(scope, "Unknown error", FSErrorCode.Generic);
    }
  },

  copyDirectory: async (
    sourceDirectoryPath: string,
    targetDirectoryPath: string,
    partialOptions?: Partial<CopyDirectoryOptions>,
  ): Promise<ResultVoid> => {
    const scope = "FS.copyDirectory";
    const options = { ...defaultCopyDirectoryOptions, ...partialOptions };

    try {
      const sourceDirectoryPathExists = await FSNode.exists(
        sourceDirectoryPath,
      );
      if (!sourceDirectoryPathExists) {
        const message = `Directory "${sourceDirectoryPath}" does not exist`;
        return R.Error(scope, message, FSErrorCode.DirectoryNotFound);
      }

      const sourceDirectoryPathIsDirectory = await FSNode.isDirectory(
        sourceDirectoryPath,
      );
      if (!sourceDirectoryPathIsDirectory) {
        const message = `"${sourceDirectoryPath}" is not a directory`;
        return R.Error(scope, message, FSErrorCode.NotDirectory);
      }

      const targetDirectoryPathExists = await FSNode.exists(
        targetDirectoryPath,
      );
      if (!options.force && targetDirectoryPathExists) {
        const message = `Directory "${targetDirectoryPath}" already exists`;
        return R.Error(scope, message, FSErrorCode.DirectoryAlreadyExists);
      }

      await FSExtra.copy(sourceDirectoryPath, targetDirectoryPath);

      return R.Void;
    } catch {
      return R.Error(scope, "Unknown error", FSErrorCode.Generic);
    }
  },

  copyFile: async (
    sourceFilePath: string,
    targetFilePath: string,
    partialOptions?: Partial<CopyFileOptions>,
  ): Promise<ResultVoid> => {
    const scope = "FS.copyFile";
    const options = { ...defaultCopyFileOptions, ...partialOptions };

    try {
      const sourceFilePathExists = await FSNode.exists(sourceFilePath);
      if (!sourceFilePathExists) {
        const message = `File "${sourceFilePath}" does not exist`;
        return R.Error(scope, message, FSErrorCode.FileNotFound);
      }

      const sourceFilePathIsFile = await FSNode.isFile(sourceFilePath);
      if (!sourceFilePathIsFile) {
        const message = `"${sourceFilePath}" is not a file`;
        return R.Error(scope, message, FSErrorCode.NotFile);
      }

      const targetFilePathExists = await FSNode.exists(targetFilePath);
      if (!options.force && targetFilePathExists) {
        const message = `File "${targetFilePath}" already exists`;
        return R.Error(scope, message, FSErrorCode.FileAlreadyExists);
      }

      await NodeFS.copyFile(sourceFilePath, targetFilePath);
      return R.Void;
    } catch {
      return R.Error(scope, "Unknown error", FSErrorCode.Generic);
    }
  },

  renameDirectory: async (
    sourceDirectoryPath: string,
    targetDirectoryPath: string,
    partialOptions?: Partial<RenameDirectoryOptions>,
  ): Promise<ResultVoid> => {
    const scope = "FS.renameDirectory";
    const options = { ...defaultRenameDirectoryOptions, ...partialOptions };

    try {
      const sourceDirectoryPathExists = await FSNode.exists(
        sourceDirectoryPath,
      );
      if (!sourceDirectoryPathExists) {
        const message = `Directory "${sourceDirectoryPath}" does not exist`;
        return R.Error(scope, message, FSErrorCode.DirectoryNotFound);
      }

      const sourceDirectoryPathIsDirectory = await FSNode.isDirectory(
        sourceDirectoryPath,
      );
      if (!sourceDirectoryPathIsDirectory) {
        const message = `"${sourceDirectoryPath}" is not a directory`;
        return R.Error(scope, message, FSErrorCode.NotDirectory);
      }

      const targetDirectoryPathExists = await FSNode.exists(
        targetDirectoryPath,
      );
      if (!options.force && targetDirectoryPathExists) {
        const message = `Directory "${targetDirectoryPath}" already exists`;
        return R.Error(scope, message, FSErrorCode.DirectoryAlreadyExists);
      }

      await FSExtra.move(sourceDirectoryPath, targetDirectoryPath, {
        overwrite: options.force,
      });
      return R.Void;
    } catch {
      return R.Error(scope, "Unknown error", FSErrorCode.Generic);
    }
  },

  renameFile: async (
    sourceFilePath: string,
    targetFilePath: string,
    partialOptions?: Partial<RenameFileOptions>,
  ): Promise<ResultVoid> => {
    const scope = "FS.renameFile";
    const options = { ...defaultRenameFileOptions, ...partialOptions };

    try {
      const sourceFilePathExists = await FSNode.exists(sourceFilePath);
      if (!sourceFilePathExists) {
        const message = `File "${sourceFilePath}" does not exist`;
        return R.Error(scope, message, FSErrorCode.FileNotFound);
      }

      const sourceFilePathIsFile = await FSNode.isFile(sourceFilePath);
      if (sourceFilePathExists && !sourceFilePathIsFile) {
        const message = `"${sourceFilePath}" is not a file`;
        return R.Error(scope, message, FSErrorCode.NotFile);
      }

      const targetFilePathExists = await FSNode.exists(targetFilePath);
      if (!options.force && targetFilePathExists) {
        const message = `File "${targetFilePath}" already exists`;
        return R.Error(scope, message, FSErrorCode.FileAlreadyExists);
      }

      await NodeFS.rename(sourceFilePath, targetFilePath);
      return R.Void;
    } catch {
      return R.Error(
        scope,
        "FS.renameFile: Unknown error",
        FSErrorCode.Generic,
      );
    }
  },

  removeDirectory: async (
    directoryPath: string,
    partialOptions?: Partial<RemoveDirectoryOptions>,
  ): Promise<ResultVoid> => {
    const scope = "FS.removeDirectory";
    const options = { ...defaultRemoveDirectoryOptions, ...partialOptions };

    try {
      const directoryPathExists = await FSNode.exists(directoryPath);
      if (options.silent && !directoryPathExists) {
        return R.Void;
      }

      if (!directoryPathExists) {
        const message = `Directory "${directoryPath}" does not exist`;
        return R.Error(scope, message, FSErrorCode.DirectoryNotFound);
      }

      const directoryPathIsDirectory = await FSNode.isDirectory(directoryPath);
      if (directoryPathExists && !directoryPathIsDirectory) {
        const message = `"${directoryPath}" is not a directory`;
        return R.Error(scope, message, FSErrorCode.NotDirectory);
      }

      await NodeFS.rm(directoryPath, { force: true, recursive: true });
      return R.Void;
    } catch {
      return R.Error(scope, "Unknown error", FSErrorCode.Generic);
    }
  },

  removeFile: async (
    filePath: string,
    partialOptions?: Partial<RemoveFileOptions>,
  ): Promise<ResultVoid> => {
    const scope = "FS.removeFile";
    const options = { ...defaultRemoveFileOptions, ...partialOptions };

    try {
      const filePathExists = await FSNode.exists(filePath);
      if (options.silent && !filePathExists) {
        return R.Void;
      }

      if (!filePathExists) {
        const message = `File "${filePath}" does not exist`;
        return R.Error(scope, message, FSErrorCode.FileNotFound);
      }

      const filePathIsFile = await FSNode.isFile(filePath);
      if (filePathExists && !filePathIsFile) {
        const message = `"${filePath}" is not a file`;
        return R.Error(scope, message, FSErrorCode.NotFile);
      }

      await NodeFS.unlink(filePath);
      return R.Void;
    } catch {
      return R.Error(scope, "Unknown error", FSErrorCode.Generic);
    }
  },

  exists: async (path: string): Promise<boolean> => {
    try {
      const stat = await NodeFS.stat(path);
      return stat.isDirectory() || stat.isFile();
    } catch {
      return false;
    }
  },

  isDirectory: async (directoryPath: string): Promise<boolean> => {
    try {
      const stat = await NodeFS.stat(directoryPath);
      return stat.isDirectory();
    } catch {
      return false;
    }
  },

  isFile: async (filePath: string): Promise<boolean> => {
    try {
      const stat = await NodeFS.stat(filePath);
      return stat.isFile();
    } catch {
      return false;
    }
  },

  readFile: async (filePath: string): Promise<Result<string>> => {
    const scope = "FS.readFile";

    try {
      const filePathExists = await FSNode.exists(filePath);
      if (!filePathExists) {
        const message = `File "${filePath}" does not exist`;
        return R.Error(scope, message, FSErrorCode.FileNotFound);
      }

      const filePathIsFile = await FSNode.isFile(filePath);
      if (!filePathIsFile) {
        const message = `"${filePath}" is not a file`;
        return R.Error(scope, message, FSErrorCode.NotFile);
      }

      try {
        const content = await NodeFS.readFile(filePath, { encoding: "utf8" });
        return R.Ok(content);
      } catch {
        const message = `Failed to read "${filePath}"`;
        return R.Error(scope, message, FSErrorCode.FailedToReadFile);
      }
    } catch {
      return R.Error(scope, "Unknown error", FSErrorCode.Generic);
    }
  },

  writeFile: async (filePath: string, content: string): Promise<ResultVoid> => {
    const scope = "FS.writeFile";

    try {
      const filePathExists = await FSNode.exists(filePath);
      const filePathIsFile = await FSNode.isFile(filePath);
      if (filePathExists && !filePathIsFile) {
        const message = `"${filePath}" is not a file`;
        return R.Error(scope, message, FSErrorCode.NotFile);
      }

      try {
        await NodeFS.writeFile(filePath, content);
      } catch {
        const message = `Failed to write "${filePath}"`;
        return R.Error(scope, message, FSErrorCode.FailedToWriteFile);
      }

      return R.Void;
    } catch {
      return R.Error(scope, "Unknown error", FSErrorCode.Generic);
    }
  },

  getDirectoryInfo: async (
    directoryPath: string,
  ): Promise<Result<DirectoryInfo>> => {
    const scope = "FS.getDirectoryInfo";

    try {
      const directoryPathExists = await FSNode.exists(directoryPath);
      if (!directoryPathExists) {
        const message = `Directory "${directoryPath}" does not exist`;
        return R.Error(scope, message, FSErrorCode.DirectoryNotFound);
      }

      const directoryPathIsDirectory = await FSNode.isDirectory(directoryPath);
      if (!directoryPathIsDirectory) {
        const message = `"${directoryPath}" is not a directory`;
        return R.Error(scope, message, FSErrorCode.NotDirectory);
      }

      const filesAndDirectories = await NodeFS.readdir(directoryPath, {
        withFileTypes: true,
      });

      const directoryNames = filesAndDirectories
        .filter((fileOrDirectory) => fileOrDirectory.isDirectory())
        .map((directory) => directory.name);

      const fileNames = filesAndDirectories
        .filter((fileOrDirectory) => fileOrDirectory.isFile())
        .map((file) => file.name);

      return R.Ok({
        path: NodePath.dirname(directoryPath),
        name: NodePath.basename(directoryPath),
        directoryNames,
        fileNames,
      });
    } catch {
      return R.Error(scope, "Unknown error", FSErrorCode.Generic);
    }
  },

  getFileInfo: async (filePath: string): Promise<Result<FileInfo>> => {
    const scope = "FS.getFileInfo";

    try {
      const filePathExists = await FSNode.exists(filePath);
      if (!filePathExists) {
        const message = `File "${filePath}" does not exist`;
        return R.Error(scope, message, FSErrorCode.FileNotFound);
      }

      const filePathIsFile = await FSNode.isFile(filePath);
      if (!filePathIsFile) {
        const message = `"${filePath}" is not a file`;
        return R.Error(scope, message, FSErrorCode.NotFile);
      }

      return R.Ok({
        path: NodePath.dirname(filePath),
        name: NodePath.basename(filePath),
        extension: NodePath.extname(filePath),
      });
    } catch {
      return R.Error(scope, "Unknown error", FSErrorCode.Generic);
    }
  },

  join: (...paths: string[]): string => {
    return NodePath.join(...paths);
  },

  getDirectoryPath: (path: string): string => {
    return NodePath.dirname(path);
  },

  getName: (path: string): string => {
    return NodePath.basename(path);
  },

  getExtension: (path: string): string => {
    return NodePath.extname(path);
  },

  downloadFile: async (
    filePath: string,
    url: string,
    partialOptions?: Partial<DownloadFileOptions>,
  ): Promise<ResultVoid> => {
    const scope = "FS.downloadFile";
    const options = { ...defaultDownloadFileOptions, ...partialOptions };

    try {
      const filePathExists = await FSNode.exists(filePath);
      if (!options.force && filePathExists) {
        const message = `File "${filePath}" already exists`;
        return R.Error(scope, message, FSErrorCode.FileAlreadyExists);
      }

      await new Promise<void>((resolve, reject) => {
        NodeHTTPS.get(url, (response) => {
          const stream = NodeFSNotPromise.createWriteStream(filePath);
          response.pipe(stream);
          stream.on("finish", () => {
            stream.close();
            resolve();
          });
          stream.on("error", (err) => {
            console.log(err);
            reject();
          });
        });
      });
      return R.Void;
    } catch {
      return R.Error(scope, "Unknown error", FSErrorCode.Generic);
    }
  },

  zipDirectory: async (
    directoryPath: string,
    targetZipFilePath: string,
    partialOptions?: Partial<ZipDirectoryOptions>,
  ): Promise<ResultVoid> => {
    const scope = "FS.zipDirectory";
    const options = { ...defaultZipDirectoryOptions, ...partialOptions };
    let result: ResultVoid;

    try {
      const directoryPathExists = await FSNode.exists(directoryPath);
      if (!directoryPathExists) {
        const message = `Directory "${directoryPathExists}" does not exist`;
        return R.Error(scope, message, FSErrorCode.DirectoryNotFound);
      }

      const directoryPathIsDirectory = await FSNode.isDirectory(directoryPath);
      if (!directoryPathIsDirectory) {
        const message = `Directory "${directoryPath}" is not a directory`;
        return R.Error(scope, message, FSErrorCode.NotDirectory);
      }

      const targetZipFilePathExists = await FSNode.exists(targetZipFilePath);
      if (!options.force && targetZipFilePathExists) {
        const message = `File "${targetZipFilePath}" already exists`;
        return R.Error(scope, message, FSErrorCode.FileAlreadyExists);
      }

      result = await FSNode.removeFile(targetZipFilePath, { silent: true });
      if (R.isError(result)) {
        const message = `Failed to remove "${targetZipFilePath}"`;
        return R.Stack(result, scope, message, FSErrorCode.Generic);
      }

      const zipFile = new AdmZip();
      zipFile.addLocalFolder(directoryPath);
      zipFile.writeZip(targetZipFilePath);

      return R.Void;
    } catch {
      return R.Error(scope, "Unknown error", FSErrorCode.Generic);
    }
  },

  unzipFile: async (
    zipFilePath: string,
    targetDirectoryPath: string,
    partialOptions?: Partial<UnzipFileOptions>,
  ): Promise<ResultVoid> => {
    const scope = "FS.unzipFile";
    const options = { ...defaultUnzipFileOptions, ...partialOptions };
    let result: ResultVoid;

    try {
      const zipFilePathExists = await FSNode.exists(zipFilePath);
      if (!zipFilePathExists) {
        const message = `File "${zipFilePath}" does not exist`;
        return R.Error(scope, message, FSErrorCode.FileNotFound);
      }

      const zipFilePathIsFile = await FSNode.isFile(zipFilePath);
      if (!zipFilePathIsFile) {
        const message = `File "${zipFilePath}" is not a file`;
        return R.Error(scope, message, FSErrorCode.NotFile);
      }

      const targetDirectoryPathExists = await FSNode.exists(
        targetDirectoryPath,
      );
      if (!options.force && targetDirectoryPathExists) {
        const message = `Directory "${targetDirectoryPathExists}" already exists`;
        return R.Error(scope, message, FSErrorCode.DirectoryAlreadyExists);
      }

      const zipFile = new AdmZip(zipFilePath);
      const archiveError = await new Promise<Error | undefined>((resolve) => {
        zipFile.extractAllToAsync(
          targetDirectoryPath,
          options.force,
          false,
          resolve,
        );
      });
      if (archiveError) {
        const message = `Failed to unzip "${targetDirectoryPath}"`;
        return R.Error(scope, message, FSErrorCode.FailedToUnzip);
      }

      if (!options.collapseSingleDirectoryArchive) {
        return R.Void;
      }

      const directoryInfoResult = await FSNode.getDirectoryInfo(
        targetDirectoryPath,
      );
      if (R.isError(directoryInfoResult)) {
        const message = "Failed to determine archive contents";
        return R.Stack(
          directoryInfoResult,
          scope,
          message,
          FSErrorCode.Generic,
        );
      }
      const { directoryNames, fileNames } = directoryInfoResult.data;
      if (directoryNames.length !== 1 || fileNames.length > 0) {
        return R.Void;
      }

      const tempDirectoryPath = `${targetDirectoryPath}-temp`;
      result = await FSNode.renameDirectory(
        NodePath.join(targetDirectoryPath, directoryNames[0]),
        tempDirectoryPath,
        { force: true },
      );
      if (R.isError(result)) {
        const message = "Failed to move inner single directory outside";
        return R.Stack(result, scope, message, FSErrorCode.Generic);
      }

      result = await FSNode.renameDirectory(
        tempDirectoryPath,
        targetDirectoryPath,
        { force: true },
      );
      if (R.isError(result)) {
        const message =
          "Failed to rename inner single directory as target directory";
        return R.Stack(result, scope, message, FSErrorCode.Generic);
      }

      return R.Void;
    } catch {
      return R.Error(scope, "Unknown error", FSErrorCode.Generic);
    }
  },
};

export default FSNode;
