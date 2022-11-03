import { z } from "zod";
import Directory, { DirectoryBag } from "./directory";
import { R, Result, ResultVoid } from "../utils/result";

export type ConfigurableBag = DirectoryBag;

export default abstract class Configurable<Config> extends Directory {
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

  protected configName = "_config.json";

  protected get configPath(): string {
    return this.path(this.configName);
  }

  protected async loadConfig(): Promise<Result<Config>> {
    const scope = this.scope("loadConfig");
    const configPath = this.configPath;

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
        `${this.configName} does not exist`,
        Configurable.ErrorCode.ConfigNotFound,
      );
    }

    this.logger.success();

    this.logger.start(`Reading config`);
    const contentResult = await this.fs.readFile(configPath);
    if (R.isError(contentResult)) {
      this.logger.failure();
      return R.Stack(
        contentResult,
        scope,
        `Failed to load ${this.configName}`,
        Configurable.ErrorCode.FailedToLoadConfiguration,
      );
    }
    this.logger.success();

    let content: unknown;
    try {
      this.logger.start(`Parsing config content`);
      content = JSON.parse(contentResult.data);
      this.logger.success();
    } catch {
      this.logger.failure();
      return R.Error(
        scope,
        `${this.configName} is not a valid JSON`,
        Configurable.ErrorCode.FailedToParseJson,
      );
    }

    this.logger.start(`Validating config content`);
    const configResult = this.ConfigSchema.safeParse(content);
    if (!configResult.success) {
      this.logger.failure();
      return R.Stack(
        R.Error(
          scope,
          configResult.error.message,
          Configurable.ErrorCode.Generic,
        ),
        scope,
        `Failed to parse ${this.configName}`,
        Configurable.ErrorCode.FailedToParseConfiguration,
      );
    }
    this.logger.success();

    return R.Ok(configResult.data);
  }

  protected async saveConfig(config: Config): Promise<ResultVoid> {
    const scope = this.scope("saveConfig");
    const configPath = this.configPath;

    let content: string;
    try {
      this.logger.start("Stringifying config");
      content = JSON.stringify(config);
      this.logger.success();
    } catch {
      this.logger.failure();
      return R.Error(
        scope,
        `Failed to stringify config`,
        Configurable.ErrorCode.FailedToStringifyJson,
      );
    }

    this.logger.start(`Writing config`);
    const result = await this.fs.writeFile(configPath, content);
    if (R.isError(result)) {
      this.logger.failure();
      return R.Stack(
        result,
        scope,
        `Failed to write config "${this.configPath}"`,
        Configurable.ErrorCode.FailedToSaveConfiguration,
      );
    }
    this.logger.success();

    return R.Void;
  }

  protected async updateConfig(
    partialConfig: Partial<Config>,
  ): Promise<ResultVoid> {
    this.logger.start("Loading config");
    const configResult = await this.loadConfig();
    if (R.isError(configResult)) {
      this.logger.failure();
      return configResult;
    }
    this.logger.success();

    const config = { ...configResult.data, ...partialConfig };

    this.logger.start("Saving config");
    const result = await this.saveConfig(config);
    if (R.isError(result)) {
      this.logger.failure();
      return result;
    }
    this.logger.success();

    return R.Void;
  }
}
