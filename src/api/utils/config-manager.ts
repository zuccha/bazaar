import { z } from "zod";
import Manager from "./manager";
import { R, Result, ResultVoid } from "./result";

export default abstract class ConfigManager<Config> extends Manager {
  static ErrorCode = {
    ConfigNotFound: "ConfigManager.ConfigNotFound",
    FailedToLoadConfiguration: "ConfigManager.FailedToLoadConfiguration",
    FailedToParseConfiguration: "ConfigManager.FailedToParseConfiguration",
    FailedToSaveConfiguration: "ConfigManager.FailedToSaveConfiguration",
    FailedToParseJson: "ConfigManager.FailedToParseJson",
    FailedToStringifyJson: "ConfigManager.FailedToStringifyJson",
    Generic: "ConfigManager.Generic",
  };

  protected abstract ConfigSchema: z.ZodType<Config>;
  protected abstract defaultConfig?: Config;

  protected async loadConfig(): Promise<Result<Config>> {
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
        ConfigManager.ErrorCode.ConfigNotFound,
      );
    }

    const contentResult = await this.fs.readFile(configPath);
    if (R.isError(contentResult)) {
      return R.Stack(
        contentResult,
        scope,
        "Failed to load config.json",
        ConfigManager.ErrorCode.FailedToLoadConfiguration,
      );
    }

    let content: unknown;
    try {
      content = JSON.parse(contentResult.data);
    } catch {
      return R.Error(
        scope,
        "config.json is not a valid JSON",
        ConfigManager.ErrorCode.FailedToParseJson,
      );
    }

    const configResult = this.ConfigSchema.safeParse(content);
    if (!configResult.success) {
      return R.Stack(
        R.Error(
          scope,
          configResult.error.message,
          ConfigManager.ErrorCode.Generic,
        ),
        scope,
        "Failed to parse config.json",
        ConfigManager.ErrorCode.FailedToParseConfiguration,
      );
    }

    return R.Ok(configResult.data);
  }

  protected async saveConfig(config: Config): Promise<ResultVoid> {
    const scope = this.scope("saveConfig");
    const configPath = this.path("config.json");

    let content: string;
    try {
      content = JSON.stringify(config);
    } catch {
      return R.Error(
        scope,
        "Configuration cannot be stringified",
        ConfigManager.ErrorCode.FailedToStringifyJson,
      );
    }

    const result = await this.fs.writeFile(configPath, content);
    if (R.isError(result)) {
      return R.Stack(
        result,
        scope,
        "Failed to save config.json",
        ConfigManager.ErrorCode.FailedToSaveConfiguration,
      );
    }

    return R.Void;
  }
}
