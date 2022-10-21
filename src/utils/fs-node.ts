import * as NodeFS from "node:fs/promises";
import * as NodePath from "node:path";
import * as FSExtra from "fs-extra";
import { DirectoryInfo, FileInfo, FS, FSError } from "../api/utils/fs";
import { R, Result, ResultVoid } from "../api/utils/result";

const FSNode: FS = {
  createDirectory: async (directoryPath: string): Promise<ResultVoid> => {
    try {
      if (await FSNode.exists(directoryPath)) {
        const message = `FS.createDirectory: Directory "${directoryPath}" already exists`;
        return R.Error(message, FSError.DirectoryAlreadyExists);
      }

      await NodeFS.mkdir(directoryPath, { recursive: true });
      return R.Void;
    } catch {
      return R.Error("FS.createDirectory: Unknown error.", FSError.Generic);
    }
  },

  copyDirectory: async (
    sourceDirectoryPath: string,
    targetDirectoryPath: string,
    options: { force: boolean },
  ): Promise<ResultVoid> => {
    try {
      if (!(await FSNode.exists(sourceDirectoryPath))) {
        const message = `FS.copyDirectory: Directory "${sourceDirectoryPath}" does not exist`;
        return R.Error(message, FSError.DirectoryNotFound);
      }

      if (!(await FSNode.isDirectory(sourceDirectoryPath))) {
        const message = `FS.copyDirectory: "${sourceDirectoryPath}" is not a directory`;
        return R.Error(message, FSError.NotDirectory);
      }

      if (!options.force && (await FSNode.exists(targetDirectoryPath))) {
        const message = `FS.copyDirectory: Directory "${targetDirectoryPath}" already exists`;
        return R.Error(message, FSError.DirectoryAlreadyExists);
      }

      await FSExtra.copy(sourceDirectoryPath, targetDirectoryPath);

      return R.Void;
    } catch {
      return R.Error("FS.copyDirectory: Unknown error.", FSError.Generic);
    }
  },

  copyFile: async (
    sourceFilePath: string,
    targetFilePath: string,
    options: { force: boolean },
  ): Promise<ResultVoid> => {
    try {
      if (!(await FSNode.exists(sourceFilePath))) {
        const message = `FS.copyFile: File "${sourceFilePath}" does not exist`;
        return R.Error(message, FSError.FileNotFound);
      }

      if (!(await FSNode.isFile(sourceFilePath))) {
        const message = `FS.copyFile: "${sourceFilePath}" is not a file`;
        return R.Error(message, FSError.NotFile);
      }

      if (!options.force && (await FSNode.exists(targetFilePath))) {
        const message = `FS.copyFile: File "${targetFilePath}" already exists`;
        return R.Error(message, FSError.FileAlreadyExists);
      }

      await NodeFS.copyFile(sourceFilePath, targetFilePath);
      return R.Void;
    } catch {
      return R.Error("FS.copyFile: Unknown error.", FSError.Generic);
    }
  },

  renameDirectory: async (
    sourceDirectoryPath: string,
    targetDirectoryPath: string,
    options: { force: boolean },
  ): Promise<ResultVoid> => {
    try {
      if (!(await FSNode.exists(sourceDirectoryPath))) {
        const message = `FS.renameDirectory: Directory "${sourceDirectoryPath}" does not exist`;
        return R.Error(message, FSError.DirectoryNotFound);
      }

      if (!(await FSNode.isDirectory(sourceDirectoryPath))) {
        const message = `FS.renameDirectory: "${sourceDirectoryPath}" is not a directory`;
        return R.Error(message, FSError.NotDirectory);
      }

      if (!options.force && (await FSNode.exists(targetDirectoryPath))) {
        const message = `FS.renameDirectory: Directory "${targetDirectoryPath}" already exists`;
        return R.Error(message, FSError.DirectoryAlreadyExists);
      }

      await NodeFS.rename(sourceDirectoryPath, targetDirectoryPath);
      return R.Void;
    } catch {
      return R.Error("FS.renameDirectory: Unknown error.", FSError.Generic);
    }
  },

  renameFile: async (
    sourceFilePath: string,
    targetFilePath: string,
    options: { force: boolean },
  ): Promise<ResultVoid> => {
    try {
      if (!(await FSNode.exists(sourceFilePath))) {
        const message = `FS.renameFile: File "${sourceFilePath}" does not exist`;
        return R.Error(message, FSError.FileNotFound);
      }

      if (!(await FSNode.isFile(sourceFilePath))) {
        const message = `FS.renameFile: "${sourceFilePath}" is not a file`;
        return R.Error(message, FSError.NotFile);
      }

      if (!options.force && (await FSNode.exists(targetFilePath))) {
        const message = `FS.renameFile: File "${targetFilePath}" already exists`;
        return R.Error(message, FSError.FileAlreadyExists);
      }

      await NodeFS.rename(sourceFilePath, targetFilePath);
      return R.Void;
    } catch {
      return R.Error("FS.renameFile: Unknown error.", FSError.Generic);
    }
  },

  removeDirectory: async (directoryPath: string): Promise<ResultVoid> => {
    try {
      if (!(await FSNode.exists(directoryPath))) {
        const message = `FS.removeDirectory: Directory "${directoryPath}" does not exist`;
        return R.Error(message, FSError.DirectoryNotFound);
      }

      if (!(await FSNode.isFile(directoryPath))) {
        const message = `FS.removeDirectory: "${directoryPath}" is not a directory`;
        return R.Error(message, FSError.NotDirectory);
      }

      await NodeFS.rm(directoryPath, { force: true, recursive: true });
      return R.Void;
    } catch {
      return R.Error("FS.removeDirectory: Unknown error.", FSError.Generic);
    }
  },

  removeFile: async (filePath: string): Promise<ResultVoid> => {
    try {
      if (!(await FSNode.exists(filePath))) {
        const message = `FS.removeFile: File "${filePath}" does not exist`;
        return R.Error(message, FSError.FileNotFound);
      }

      if (!(await FSNode.isFile(filePath))) {
        const message = `FS.removeFile: "${filePath}" is not a file`;
        return R.Error(message, FSError.NotFile);
      }

      await NodeFS.unlink(filePath);
      return R.Void;
    } catch {
      return R.Error("FS.removeFile: Unknown error.", FSError.Generic);
    }
  },

  exists: async (path: string): Promise<Result<boolean>> => {
    try {
      const stat = await NodeFS.stat(path);
      return R.Ok(stat.isDirectory() || stat.isFile());
    } catch {
      return R.Error("FS.exists: Unknown error.", FSError.Generic);
    }
  },

  isDirectory: async (directoryPath: string): Promise<Result<boolean>> => {
    try {
      const stat = await NodeFS.stat(directoryPath);
      return R.Ok(stat.isDirectory());
    } catch {
      return R.Error("FS.isDirectory: Unknown error.", FSError.Generic);
    }
  },

  isFile: async (filePath: string): Promise<Result<boolean>> => {
    try {
      const stat = await NodeFS.stat(filePath);
      return R.Ok(stat.isFile());
    } catch {
      return R.Error("FS.isFile: Unknown error.", FSError.Generic);
    }
  },

  readFile: async (filePath: string): Promise<Result<string>> => {
    try {
      if (!(await FSNode.exists(filePath))) {
        const message = `FS.readFile: File "${filePath}" does not exist`;
        return R.Error(message, FSError.FileNotFound);
      }

      if (!(await FSNode.isFile(filePath))) {
        const message = `FS.readFile: "${filePath}" is not a file`;
        return R.Error(message, FSError.NotFile);
      }

      const content = await NodeFS.readFile(filePath, { encoding: "utf8" });
      return R.Ok(content);
    } catch {
      return R.Error("FS.readFile: Unknown error.", FSError.Generic);
    }
  },

  getDirectoryInfo: async (
    directoryPath: string,
  ): Promise<Result<DirectoryInfo>> => {
    try {
      if (!(await FSNode.exists(directoryPath))) {
        const message = `FS.getDirectoryInfo: Directory "${directoryPath}" does not exist`;
        return R.Error(message, FSError.DirectoryNotFound);
      }

      if (!(await FSNode.isDirectory(directoryPath))) {
        const message = `FS.getDirectoryInfo: "${directoryPath}" is not a file`;
        return R.Error(message, FSError.NotDirectory);
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
      return R.Error("FS.getDirectoryInfo: Unknown error.", FSError.Generic);
    }
  },

  getFileInfo: async (filePath: string): Promise<Result<FileInfo>> => {
    try {
      if (!(await FSNode.exists(filePath))) {
        const message = `FS.getFileInfo: File "${filePath}" does not exist`;
        return R.Error(message, FSError.FileNotFound);
      }

      if (!(await FSNode.isFile(filePath))) {
        const message = `FS.getFileInfo: "${filePath}" is not a file`;
        return R.Error(message, FSError.NotFile);
      }

      return R.Ok({
        path: NodePath.dirname(filePath),
        name: NodePath.basename(filePath),
        extension: NodePath.extname(filePath),
      });
    } catch {
      return R.Error("FS.getFileInfo: Unknown error.", FSError.Generic);
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
