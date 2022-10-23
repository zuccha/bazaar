import { z } from "zod";
import Manager from "./manager";
import { R, Result, ResultVoid } from "./result";

export enum ConfigManagerError {
  ConfigNotFound,
  FailedToLoadConfiguration,
  FailedToParseConfiguration,
  FailedToSaveConfiguration,
  NotJson,
  Generic,
}

export default abstract class ConfigManager<Config> extends Manager {
  protected abstract ConfigSchema: z.ZodType<Config>;
  protected abstract defaultConfig?: Config;

  async loadConfig(): Promise<Result<Config>> {
    const scope = this.scope("loadConfig");
    const configPath = this.path("config.json");

    const configPathExists = await this.fs.exists(configPath);
    if (!configPathExists && this.defaultConfig) {
      return R.Ok(this.defaultConfig);
    }

    if (!configPathExists) {
      return R.Error(
        scope,
        "config.json does not exist",
        ConfigManagerError.ConfigNotFound,
      );
    }

    const contentResult = await this.fs.readFile(configPath);
    if (R.isError(contentResult)) {
      return R.Stack(
        contentResult,
        scope,
        "Failed to load config.json",
        ConfigManagerError.FailedToLoadConfiguration,
      );
    }

    let content: unknown;
    try {
      content = JSON.parse(contentResult.data);
    } catch {
      return R.Error(
        scope,
        "config.json is not a valid JSON",
        ConfigManagerError.NotJson,
      );
    }

    const configResult = this.ConfigSchema.safeParse(content);
    if (!configResult.success) {
      return R.Stack(
        R.Error(scope, configResult.error.message, ConfigManagerError.Generic),
        scope,
        "Failed to parse config.json",
        ConfigManagerError.FailedToParseConfiguration,
      );
    }

    return R.Ok(configResult.data);
  }

  async saveConfig(/* config: Config */): Promise<ResultVoid> {
    // TODO.
    return Promise.resolve(R.Void);
  }
}
