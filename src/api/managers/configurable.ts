import { z } from "zod";
import Directory, { DirectoryBag } from "./directory";
import { R, Result, ResultVoid } from "../utils/result";

export type ConfigurableBag = DirectoryBag;

export enum ConfigurableErrorCode {
  Internal,
  ConfigIsEmpty,
  ConfigNotFound,
  ConfigNotValid,
}

export type ConfigurableErrorCodes = {
  LoadConfig:
    | ConfigurableErrorCode.Internal
    | ConfigurableErrorCode.ConfigNotFound
    | ConfigurableErrorCode.ConfigNotValid;
  SaveConfig: ConfigurableErrorCode.Internal;
  UpdateConfig:
    | ConfigurableErrorCodes["LoadConfig"]
    | ConfigurableErrorCode.ConfigIsEmpty;
  ValidateConfig:
    | ConfigurableErrorCode.ConfigNotFound
    | ConfigurableErrorCode.ConfigNotValid;
};

export default abstract class Configurable<
  Config extends Record<string | number | symbol, unknown>,
> extends Directory {
  protected abstract ConfigSchema: z.ZodType<Config>;
  protected abstract defaultConfig?: Config;

  protected configName = "_config.json";

  protected get configPath(): string {
    return this.path(this.configName);
  }

  protected async validateConfig(): Promise<
    ResultVoid<ConfigurableErrorCodes["ValidateConfig"]>
  > {
    const scope = this.scope("validateConfig");

    this.logger.start("Checking if config exists");
    const exists = await this.exists();
    if (!exists) {
      this.logger.failure();

      this.logger.start("Checking if a default config is present");
      if (this.defaultConfig) {
        this.logger.success();
        return R.Void;
      }

      this.logger.failure();
      return R.Error(
        scope,
        `Config "${this.configPath}" does not exist`,
        ConfigurableErrorCode.ConfigNotFound,
      );
    }
    this.logger.success();

    this.logger.start(`Checking if config is valid`);
    const configIsFile = await this.fs.isFile(this.configPath);
    if (!configIsFile) {
      this.logger.failure();
      const message = `Config "${this.configPath}" is not valid`;
      return R.Error(scope, message, ConfigurableErrorCode.ConfigNotValid);
    }
    this.logger.success();

    return R.Void;
  }

  protected async loadConfig(): Promise<
    Result<Config, ConfigurableErrorCodes["LoadConfig"]>
  > {
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
        `Config "${this.configPath}" does not exist`,
        ConfigurableErrorCode.ConfigNotFound,
      );
    }

    this.logger.success();

    this.logger.start(`Checking if config is valid`);
    const configIsFile = await this.fs.isFile(this.configPath);
    if (!configIsFile) {
      this.logger.failure();
      const message = `Config "${this.configPath}" is not valid`;
      return R.Error(scope, message, ConfigurableErrorCode.ConfigNotValid);
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
        ConfigurableErrorCode.Internal,
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
        ConfigurableErrorCode.Internal,
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
          ConfigurableErrorCode.Internal,
        ),
        scope,
        `Failed to parse ${this.configName}`,
        ConfigurableErrorCode.Internal,
      );
    }
    this.logger.success();

    return R.Ok(configResult.data);
  }

  protected async saveConfig(
    config: Config,
  ): Promise<ResultVoid<ConfigurableErrorCodes["SaveConfig"]>> {
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
        ConfigurableErrorCode.Internal,
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
        ConfigurableErrorCode.Internal,
      );
    }
    this.logger.success();

    return R.Void;
  }

  protected async updateConfig(
    partialConfig: Partial<Config>,
  ): Promise<ResultVoid<ConfigurableErrorCodes["UpdateConfig"]>> {
    const scope = this.scope("updateConfig");

    if (Object.keys(partialConfig).length === 0) {
      const message = "The given config is empty, there is nothing to update";
      return R.Error(scope, message, ConfigurableErrorCode.ConfigIsEmpty);
    }

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
