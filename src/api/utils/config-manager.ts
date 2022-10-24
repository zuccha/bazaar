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

    this.log("Checking if config exists or a default config is present...");
    const configPathExists = await this.fs.exists(configPath);
    if (!configPathExists && this.defaultConfig) {
      this.log("A default config is present");
      return R.Ok(this.defaultConfig);
    }

    if (!configPathExists) {
      return R.Error(
        scope,
        "config.json does not exist",
        ConfigManager.ErrorCode.ConfigNotFound,
      );
    }
    this.log("A config exists");

    this.log("Reading config.json...");
    const contentResult = await this.fs.readFile(configPath);
    if (R.isError(contentResult)) {
      return R.Stack(
        contentResult,
        scope,
        "Failed to load config.json",
        ConfigManager.ErrorCode.FailedToLoadConfiguration,
      );
    }
    this.log("config.json read");

    let content: unknown;
    try {
      this.log("Parsing config.json content...");
      content = JSON.parse(contentResult.data);
      this.log("config.json content parsed");
    } catch {
      return R.Error(
        scope,
        "config.json is not a valid JSON",
        ConfigManager.ErrorCode.FailedToParseJson,
      );
    }

    this.log("Validating config.json content...");
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
    this.log("config.json content validated");

    return R.Ok(configResult.data);
  }

  protected async saveConfig(config: Config): Promise<ResultVoid> {
    const scope = this.scope("saveConfig");
    const configPath = this.path("config.json");

    let content: string;
    try {
      this.log("Stringifying config...");
      content = JSON.stringify(config);
      this.log("Config stringified...");
    } catch {
      return R.Error(
        scope,
        "Configuration cannot be stringified",
        ConfigManager.ErrorCode.FailedToStringifyJson,
      );
    }

    this.log("Writing config.json...");
    const result = await this.fs.writeFile(configPath, content);
    if (R.isError(result)) {
      return R.Stack(
        result,
        scope,
        "Failed to save config.json",
        ConfigManager.ErrorCode.FailedToSaveConfiguration,
      );
    }
    this.log("config.json written");

    return R.Void;
  }
}
