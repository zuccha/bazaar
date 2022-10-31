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

  private get _configPath() {
    return this.path("_config.json");
  }

  protected async hasConfig(): Promise<boolean> {
    const configPath = this._configPath;
    return this.fs.exists(configPath);
  }

  protected async loadConfig(): Promise<Result<Config>> {
    const scope = this.scope("loadConfig");
    const configPath = this._configPath;

    this.logger.start("Checking if config exists");
    const configPathExists = await this.fs.exists(configPath);
    if (!configPathExists) {
      this.logger.failure();

      this.logger.start("Checking if a default config is present");
      if (this.defaultConfig) {
        this.logger.success();
        return R.Ok(this.defaultConfig);
      }

      this.logger.failure();
      return R.Error(
        scope,
        "_config.json does not exist",
        ConfigManager.ErrorCode.ConfigNotFound,
      );
    }

    this.logger.success();

    this.logger.start("Reading _config.json");
    const contentResult = await this.fs.readFile(configPath);
    if (R.isError(contentResult)) {
      this.logger.failure();
      return R.Stack(
        contentResult,
        scope,
        "Failed to load _config.json",
        ConfigManager.ErrorCode.FailedToLoadConfiguration,
      );
    }
    this.logger.success();

    let content: unknown;
    try {
      this.logger.start("Parsing _config.json content");
      content = JSON.parse(contentResult.data);
      this.logger.success();
    } catch {
      this.logger.failure();
      return R.Error(
        scope,
        "_config.json is not a valid JSON",
        ConfigManager.ErrorCode.FailedToParseJson,
      );
    }

    this.logger.start("Validating _config.json content");
    const configResult = this.ConfigSchema.safeParse(content);
    if (!configResult.success) {
      this.logger.failure();
      return R.Stack(
        R.Error(
          scope,
          configResult.error.message,
          ConfigManager.ErrorCode.Generic,
        ),
        scope,
        "Failed to parse _config.json",
        ConfigManager.ErrorCode.FailedToParseConfiguration,
      );
    }
    this.logger.success();

    return R.Ok(configResult.data);
  }

  protected async saveConfig(config: Config): Promise<ResultVoid> {
    const scope = this.scope("saveConfig");
    const configPath = this._configPath;

    let content: string;
    try {
      this.logger.start("Stringifying config");
      content = JSON.stringify(config);
      this.logger.success();
    } catch {
      this.logger.failure();
      return R.Error(
        scope,
        "Configuration cannot be stringified",
        ConfigManager.ErrorCode.FailedToStringifyJson,
      );
    }

    this.logger.start("Writing _config.json");
    const result = await this.fs.writeFile(configPath, content);
    if (R.isError(result)) {
      this.logger.failure();
      return R.Stack(
        result,
        scope,
        "Failed to save _config.json",
        ConfigManager.ErrorCode.FailedToSaveConfiguration,
      );
    }
    this.logger.success();

    return R.Void;
  }
}
