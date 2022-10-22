import * as NodeFS from "node:fs/promises";
import * as NodePath from "node:path";
import * as FSExtra from "fs-extra";
import { DirectoryInfo, FileInfo, FS, FSError } from "../api/utils/fs";
import { R, Result, ResultVoid } from "../api/utils/result";

const FSNode: FS = {
  createDirectory: async (directoryPath: string): Promise<ResultVoid> => {
    const scope = "FS.createDirectory";

    try {
      if (await FSNode.exists(directoryPath)) {
        const message = `Directory "${directoryPath}" already exists`;
        return R.Error(scope, message, FSError.DirectoryAlreadyExists);
      }

      await NodeFS.mkdir(directoryPath, { recursive: true });
      return R.Void;
    } catch {
      return R.Error(scope, "Unknown error.", FSError.Generic);
    }
  },

  copyDirectory: async (
    sourceDirectoryPath: string,
    targetDirectoryPath: string,
    options: { force: boolean },
  ): Promise<ResultVoid> => {
    const scope = "FS.copyDirectory";

    try {
      if (!(await FSNode.exists(sourceDirectoryPath))) {
        const message = `Directory "${sourceDirectoryPath}" does not exist`;
        return R.Error(scope, message, FSError.DirectoryNotFound);
      }

      if (!(await FSNode.isDirectory(sourceDirectoryPath))) {
        const message = `"${sourceDirectoryPath}" is not a directory`;
        return R.Error(scope, message, FSError.NotDirectory);
      }

      if (!options.force && (await FSNode.exists(targetDirectoryPath))) {
        const message = `Directory "${targetDirectoryPath}" already exists`;
        return R.Error(scope, message, FSError.DirectoryAlreadyExists);
      }

      await FSExtra.copy(sourceDirectoryPath, targetDirectoryPath);

      return R.Void;
    } catch {
      return R.Error(scope, "Unknown error.", FSError.Generic);
    }
  },

  copyFile: async (
    sourceFilePath: string,
    targetFilePath: string,
    options: { force: boolean },
  ): Promise<ResultVoid> => {
    const scope = "FS.copyFile";

    try {
      if (!(await FSNode.exists(sourceFilePath))) {
        const message = `File "${sourceFilePath}" does not exist`;
        return R.Error(scope, message, FSError.FileNotFound);
      }

      if (!(await FSNode.isFile(sourceFilePath))) {
        const message = `"${sourceFilePath}" is not a file`;
        return R.Error(scope, message, FSError.NotFile);
      }

      if (!options.force && (await FSNode.exists(targetFilePath))) {
        const message = `File "${targetFilePath}" already exists`;
        return R.Error(scope, message, FSError.FileAlreadyExists);
      }

      await NodeFS.copyFile(sourceFilePath, targetFilePath);
      return R.Void;
    } catch {
      return R.Error(scope, "Unknown error.", FSError.Generic);
    }
  },

  renameDirectory: async (
    sourceDirectoryPath: string,
    targetDirectoryPath: string,
    options: { force: boolean },
  ): Promise<ResultVoid> => {
    const scope = "FS.renameDirectory";

    try {
      if (!(await FSNode.exists(sourceDirectoryPath))) {
        const message = `Directory "${sourceDirectoryPath}" does not exist`;
        return R.Error(scope, message, FSError.DirectoryNotFound);
      }

      if (!(await FSNode.isDirectory(sourceDirectoryPath))) {
        const message = `"${sourceDirectoryPath}" is not a directory`;
        return R.Error(scope, message, FSError.NotDirectory);
      }

      if (!options.force && (await FSNode.exists(targetDirectoryPath))) {
        const message = `Directory "${targetDirectoryPath}" already exists`;
        return R.Error(scope, message, FSError.DirectoryAlreadyExists);
      }

      await NodeFS.rename(sourceDirectoryPath, targetDirectoryPath);
      return R.Void;
    } catch {
      return R.Error(scope, "Unknown error.", FSError.Generic);
    }
  },

  renameFile: async (
    sourceFilePath: string,
    targetFilePath: string,
    options: { force: boolean },
  ): Promise<ResultVoid> => {
    const scope = "FS.renameFile";

    try {
      if (!(await FSNode.exists(sourceFilePath))) {
        const message = `File "${sourceFilePath}" does not exist`;
        return R.Error(scope, message, FSError.FileNotFound);
      }

      if (!(await FSNode.isFile(sourceFilePath))) {
        const message = `"${sourceFilePath}" is not a file`;
        return R.Error(scope, message, FSError.NotFile);
      }

      if (!options.force && (await FSNode.exists(targetFilePath))) {
        const message = `File "${targetFilePath}" already exists`;
        return R.Error(scope, message, FSError.FileAlreadyExists);
      }

      await NodeFS.rename(sourceFilePath, targetFilePath);
      return R.Void;
    } catch {
      return R.Error(scope, "FS.renameFile: Unknown error.", FSError.Generic);
    }
  },

  removeDirectory: async (directoryPath: string): Promise<ResultVoid> => {
    const scope = "FS.removeDirectory";

    try {
      if (!(await FSNode.exists(directoryPath))) {
        const message = `Directory "${directoryPath}" does not exist`;
        return R.Error(scope, message, FSError.DirectoryNotFound);
      }

      if (!(await FSNode.isFile(directoryPath))) {
        const message = `"${directoryPath}" is not a directory`;
        return R.Error(scope, message, FSError.NotDirectory);
      }

      await NodeFS.rm(directoryPath, { force: true, recursive: true });
      return R.Void;
    } catch {
      return R.Error(scope, "Unknown error.", FSError.Generic);
    }
  },

  removeFile: async (filePath: string): Promise<ResultVoid> => {
    const scope = "FS.removeFile";

    try {
      if (!(await FSNode.exists(filePath))) {
        const message = `File "${filePath}" does not exist`;
        return R.Error(scope, message, FSError.FileNotFound);
      }

      if (!(await FSNode.isFile(filePath))) {
        const message = `"${filePath}" is not a file`;
        return R.Error(scope, message, FSError.NotFile);
      }

      await NodeFS.unlink(filePath);
      return R.Void;
    } catch {
      return R.Error(scope, "Unknown error.", FSError.Generic);
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
      if (!(await FSNode.exists(filePath))) {
        const message = `File "${filePath}" does not exist`;
        return R.Error(scope, message, FSError.FileNotFound);
      }

      if (!(await FSNode.isFile(filePath))) {
        const message = `"${filePath}" is not a file`;
        return R.Error(scope, message, FSError.NotFile);
      }

      const content = await NodeFS.readFile(filePath, { encoding: "utf8" });
      return R.Ok(content);
    } catch {
      return R.Error(scope, "Unknown error.", FSError.Generic);
    }
  },

  getDirectoryInfo: async (
    directoryPath: string,
  ): Promise<Result<DirectoryInfo>> => {
    const scope = "FS.getDirectoryInfo";

    try {
      if (!(await FSNode.exists(directoryPath))) {
        const message = `Directory "${directoryPath}" does not exist`;
        return R.Error(scope, message, FSError.DirectoryNotFound);
      }

      if (!(await FSNode.isDirectory(directoryPath))) {
        const message = `"${directoryPath}" is not a file`;
        return R.Error(scope, message, FSError.NotDirectory);
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
      return R.Error(scope, "Unknown error.", FSError.Generic);
    }
  },

  getFileInfo: async (filePath: string): Promise<Result<FileInfo>> => {
    const scope = "FS.getFileInfo";

    try {
      if (!(await FSNode.exists(filePath))) {
        const message = `File "${filePath}" does not exist`;
        return R.Error(scope, message, FSError.FileNotFound);
      }

      if (!(await FSNode.isFile(filePath))) {
        const message = `"${filePath}" is not a file`;
        return R.Error(scope, message, FSError.NotFile);
      }

      return R.Ok({
        path: NodePath.dirname(filePath),
        name: NodePath.basename(filePath),
        extension: NodePath.extname(filePath),
      });
    } catch {
      return R.Error(scope, "Unknown error.", FSError.Generic);
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
};

export default FSNode;
