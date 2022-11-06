import * as NodeChildProcess from "node:child_process";
import * as NodeFSNotPromise from "node:fs";
import * as NodeFS from "node:fs/promises";
import * as NodeHTTPS from "node:https";
import * as NodePath from "node:path";
import * as AdmZip from "adm-zip";
import * as FSExtra from "fs-extra";
import {
  CopyDirectory,
  CopyFile,
  CreateDirectory,
  DirectoryInfo,
  DownloadFile,
  FSErrorCode,
  Exec,
  FileInfo,
  FS,
  GetDirectoryInfo,
  GetFileInfo,
  ReadFile,
  RemoveDirectory,
  RemoveFile,
  RenameDirectory,
  RenameFile,
  ShellOutput,
  UnzipFile,
  WriteFile,
  ZipDirectory,
} from "../api/utils/fs";
import { R, Result, ResultVoid } from "../api/utils/result";

const FSNode: FS = {
  ErrorCode: FSErrorCode,

  createDirectory: async (
    directoryPath: string,
  ): Promise<ResultVoid<CreateDirectory.ErrorCode>> => {
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
      return R.Error(scope, "Unknown error", FSErrorCode.Internal);
    }
  },

  copyDirectory: async (
    sourceDirectoryPath: string,
    targetDirectoryPath: string,
    partialOptions?: Partial<CopyDirectory.Options>,
  ): Promise<ResultVoid<CopyDirectory.ErrorCode>> => {
    const scope = "FS.copyDirectory";
    const options = { ...CopyDirectory.defaultOptions, ...partialOptions };

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
        return R.Error(scope, message, FSErrorCode.DirectoryNotValid);
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
      return R.Error(scope, "Unknown error", FSErrorCode.Internal);
    }
  },

  copyFile: async (
    sourceFilePath: string,
    targetFilePath: string,
    partialOptions?: Partial<CopyFile.Options>,
  ): Promise<ResultVoid<CopyFile.ErrorCode>> => {
    const scope = "FS.copyFile";
    const options = { ...CopyFile.defaultOptions, ...partialOptions };

    try {
      const sourceFilePathExists = await FSNode.exists(sourceFilePath);
      if (!sourceFilePathExists) {
        const message = `File "${sourceFilePath}" does not exist`;
        return R.Error(scope, message, FSErrorCode.FileNotFound);
      }

      const sourceFilePathIsFile = await FSNode.isFile(sourceFilePath);
      if (!sourceFilePathIsFile) {
        const message = `"${sourceFilePath}" is not a file`;
        return R.Error(scope, message, FSErrorCode.FileNotValid);
      }

      const targetFilePathExists = await FSNode.exists(targetFilePath);
      if (!options.force && targetFilePathExists) {
        const message = `File "${targetFilePath}" already exists`;
        return R.Error(scope, message, FSErrorCode.FileAlreadyExists);
      }

      const targetDirectoryPath = FSNode.getDirectoryPath(targetFilePath);
      const targetDirectoryPathExists = await FSNode.exists(
        targetDirectoryPath,
      );
      if (!targetDirectoryPathExists) {
        const result = await FSNode.createDirectory(targetDirectoryPath);
        if (R.isError(result)) {
          const message = `Failed to create directory "${targetDirectoryPath}" while copying file`;
          return R.Stack(result, scope, message, FSErrorCode.Internal);
        }
      }

      await NodeFS.copyFile(sourceFilePath, targetFilePath);
      return R.Void;
    } catch {
      return R.Error(scope, "Unknown error", FSErrorCode.Internal);
    }
  },

  renameDirectory: async (
    sourceDirectoryPath: string,
    targetDirectoryPath: string,
    partialOptions?: Partial<RenameDirectory.Options>,
  ): Promise<ResultVoid<RenameDirectory.ErrorCode>> => {
    const scope = "FS.renameDirectory";
    const options = { ...RenameDirectory.defaultOptions, ...partialOptions };

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
        return R.Error(scope, message, FSErrorCode.DirectoryNotValid);
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
      return R.Error(scope, "Unknown error", FSErrorCode.Internal);
    }
  },

  renameFile: async (
    sourceFilePath: string,
    targetFilePath: string,
    partialOptions?: Partial<RenameFile.Options>,
  ): Promise<ResultVoid<RenameFile.ErrorCode>> => {
    const scope = "FS.renameFile";
    const options = { ...RenameFile.defaultOptions, ...partialOptions };

    try {
      const sourceFilePathExists = await FSNode.exists(sourceFilePath);
      if (!sourceFilePathExists) {
        const message = `File "${sourceFilePath}" does not exist`;
        return R.Error(scope, message, FSErrorCode.FileNotFound);
      }

      const sourceFilePathIsFile = await FSNode.isFile(sourceFilePath);
      if (sourceFilePathExists && !sourceFilePathIsFile) {
        const message = `"${sourceFilePath}" is not a file`;
        return R.Error(scope, message, FSErrorCode.FileNotValid);
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
        FSErrorCode.Internal,
      );
    }
  },

  removeDirectory: async (
    directoryPath: string,
    partialOptions?: Partial<RemoveDirectory.Options>,
  ): Promise<ResultVoid<RemoveDirectory.ErrorCode>> => {
    const scope = "FS.removeDirectory";
    const options = { ...RemoveDirectory.defaultOptions, ...partialOptions };

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
        return R.Error(scope, message, FSErrorCode.DirectoryNotValid);
      }

      await NodeFS.rm(directoryPath, { force: true, recursive: true });
      return R.Void;
    } catch {
      return R.Error(scope, "Unknown error", FSErrorCode.Internal);
    }
  },

  removeFile: async (
    filePath: string,
    partialOptions?: Partial<RemoveFile.Options>,
  ): Promise<ResultVoid<RemoveFile.ErrorCode>> => {
    const scope = "FS.removeFile";
    const options = { ...RemoveFile.defaultOptions, ...partialOptions };

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
        return R.Error(scope, message, FSErrorCode.FileNotValid);
      }

      await NodeFS.unlink(filePath);
      return R.Void;
    } catch {
      return R.Error(scope, "Unknown error", FSErrorCode.Internal);
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

  readFile: async (
    filePath: string,
  ): Promise<Result<string, ReadFile.ErrorCode>> => {
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
        return R.Error(scope, message, FSErrorCode.FileNotValid);
      }

      try {
        const content = await NodeFS.readFile(filePath, { encoding: "utf8" });
        return R.Ok(content);
      } catch {
        const message = `Failed to read "${filePath}"`;
        return R.Error(scope, message, FSErrorCode.Internal);
      }
    } catch {
      return R.Error(scope, "Unknown error", FSErrorCode.Internal);
    }
  },

  writeFile: async (
    filePath: string,
    content: string,
  ): Promise<ResultVoid<WriteFile.ErrorCode>> => {
    const scope = "FS.writeFile";

    try {
      const filePathExists = await FSNode.exists(filePath);
      const filePathIsFile = await FSNode.isFile(filePath);
      if (filePathExists && !filePathIsFile) {
        const message = `"${filePath}" is not a file`;
        return R.Error(scope, message, FSErrorCode.FileNotValid);
      }

      const directoryPath = FSNode.getDirectoryPath(filePath);
      const directoryPathExists = await FSNode.exists(directoryPath);
      if (!directoryPathExists) {
        const result = await FSNode.createDirectory(directoryPath);
        if (R.isError(result)) {
          const message = `Failed to create directory "${directoryPath}" while writing file`;
          return R.Stack(result, scope, message, FSErrorCode.Internal);
        }
      }

      try {
        await NodeFS.writeFile(filePath, content);
      } catch {
        const message = `Failed to write "${filePath}"`;
        return R.Error(scope, message, FSErrorCode.Internal);
      }

      return R.Void;
    } catch {
      return R.Error(scope, "Unknown error", FSErrorCode.Internal);
    }
  },

  getDirectoryInfo: async (
    directoryPath: string,
  ): Promise<Result<DirectoryInfo, GetDirectoryInfo.ErrorCode>> => {
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
        return R.Error(scope, message, FSErrorCode.DirectoryNotValid);
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
      return R.Error(scope, "Unknown error", FSErrorCode.Internal);
    }
  },

  getFileInfo: async (
    filePath: string,
  ): Promise<Result<FileInfo, GetFileInfo.ErrorCode>> => {
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
        return R.Error(scope, message, FSErrorCode.FileNotValid);
      }

      return R.Ok({
        path: NodePath.dirname(filePath),
        name: NodePath.basename(filePath),
        extension: NodePath.extname(filePath),
      });
    } catch {
      return R.Error(scope, "Unknown error", FSErrorCode.Internal);
    }
  },

  join: (...paths: string[]): string => {
    return NodePath.join(...paths);
  },

  resolve: (...paths: string[]): string => {
    return NodePath.resolve(...paths);
  },

  getDirectoryPath: (path: string): string => {
    return NodePath.dirname(path);
  },

  getRelativePath: (fromPath: string, toPath: string): string => {
    return NodePath.relative(fromPath, toPath);
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
    partialOptions?: Partial<DownloadFile.Options>,
  ): Promise<ResultVoid<DownloadFile.ErrorCode>> => {
    const scope = "FS.downloadFile";
    const options = { ...DownloadFile.defaultOptions, ...partialOptions };

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
      return R.Error(scope, "Unknown error", FSErrorCode.Internal);
    }
  },

  zipDirectory: async (
    directoryPath: string,
    targetZipFilePath: string,
    partialOptions?: Partial<ZipDirectory.Options>,
  ): Promise<ResultVoid<ZipDirectory.ErrorCode>> => {
    const scope = "FS.zipDirectory";
    const options = { ...ZipDirectory.defaultOptions, ...partialOptions };

    try {
      const directoryPathExists = await FSNode.exists(directoryPath);
      if (!directoryPathExists) {
        const message = `Directory "${directoryPathExists}" does not exist`;
        return R.Error(scope, message, FSErrorCode.DirectoryNotFound);
      }

      const directoryPathIsDirectory = await FSNode.isDirectory(directoryPath);
      if (!directoryPathIsDirectory) {
        const message = `Directory "${directoryPath}" is not a directory`;
        return R.Error(scope, message, FSErrorCode.DirectoryNotValid);
      }

      const targetZipFilePathExists = await FSNode.exists(targetZipFilePath);
      if (!options.force && targetZipFilePathExists) {
        const message = `File "${targetZipFilePath}" already exists`;
        return R.Error(scope, message, FSErrorCode.FileAlreadyExists);
      }

      const result = await FSNode.removeFile(targetZipFilePath, {
        silent: true,
      });
      if (R.isError(result)) {
        const message = `Failed to remove "${targetZipFilePath}"`;
        return R.Stack(result, scope, message, FSErrorCode.Internal);
      }

      const zipFile = new AdmZip();
      zipFile.addLocalFolder(directoryPath);
      zipFile.writeZip(targetZipFilePath);

      return R.Void;
    } catch {
      return R.Error(scope, "Unknown error", FSErrorCode.Internal);
    }
  },

  unzipFile: async (
    zipFilePath: string,
    targetDirectoryPath: string,
    partialOptions?: Partial<UnzipFile.Options>,
  ): Promise<ResultVoid<UnzipFile.ErrorCode>> => {
    const scope = "FS.unzipFile";
    const options = { ...UnzipFile.defaultOptions, ...partialOptions };

    try {
      const zipFilePathExists = await FSNode.exists(zipFilePath);
      if (!zipFilePathExists) {
        const message = `File "${zipFilePath}" does not exist`;
        return R.Error(scope, message, FSErrorCode.FileNotFound);
      }

      const zipFilePathIsFile = await FSNode.isFile(zipFilePath);
      if (!zipFilePathIsFile) {
        const message = `File "${zipFilePath}" is not a file`;
        return R.Error(scope, message, FSErrorCode.FileNotValid);
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
        return R.Error(scope, message, FSErrorCode.Internal);
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
          FSErrorCode.Internal,
        );
      }
      const { directoryNames, fileNames } = directoryInfoResult.data;
      if (directoryNames.length !== 1 || fileNames.length > 0) {
        return R.Void;
      }

      let result: ResultVoid<RenameDirectory.ErrorCode>;

      const tempDirectoryPath = `${targetDirectoryPath}-temp`;
      result = await FSNode.renameDirectory(
        NodePath.join(targetDirectoryPath, directoryNames[0]!),
        tempDirectoryPath,
        { force: true },
      );
      if (R.isError(result)) {
        const message = "Failed to move inner single directory outside";
        return R.Stack(result, scope, message, FSErrorCode.Internal);
      }

      result = await FSNode.renameDirectory(
        tempDirectoryPath,
        targetDirectoryPath,
        { force: true },
      );
      if (R.isError(result)) {
        const message =
          "Failed to rename inner single directory as target directory";
        return R.Stack(result, scope, message, FSErrorCode.Internal);
      }

      return R.Void;
    } catch {
      return R.Error(scope, "Unknown error", FSErrorCode.Internal);
    }
  },

  exec: (command: string): Promise<Result<ShellOutput, Exec.ErrorCode>> => {
    const scope = "FS.exec";

    return new Promise((resolve) => {
      NodeChildProcess.exec(command, (error, stdout, stderr) => {
        const result = error
          ? R.Stack(
              R.Error(scope, error.message, FSErrorCode.Internal),
              scope,
              "Failed to run shell command",
              FSErrorCode.Internal,
            )
          : R.Ok({ stdout, stderr });
        resolve(result);
      });
    });
  },
};

export default FSNode;
