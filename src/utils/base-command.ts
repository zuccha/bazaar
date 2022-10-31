import { CliUx, Command, Config, Flags, Interfaces } from "@oclif/core";
import Api from "../api";
import FSNode from "./fs-node";
import TE from "./text-effect";

enum LogLevel {
  Debug = "debug",
  Info = "info",
  Warn = "warn",
  Error = "error",
}

export type BaseFlags<T extends typeof Command> = Interfaces.InferredFlags<
  typeof BaseCommand["globalFlags"] & T["flags"]
>;

export default abstract class BaseCommand<
  T extends typeof Command,
> extends Command {
  static globalFlags = {
    "log-level": Flags.enum<LogLevel>({
      summary: "Specify level for logging",
      options: Object.values(LogLevel),
      default: LogLevel.Info,
      helpGroup: "GLOBAL",
    }),
    verbose: Flags.boolean({
      summary: "Produce more logs (info level)",
      default: false,
      helpGroup: "GLOBAL",
    }),
  };

  protected flags!: BaseFlags<T>;
  protected api: Api;

  public constructor(argv: string[], config: Config) {
    super(argv, config);
    this.api = new Api({
      cacheDirectoryPath:
        this.config.platform === "darwin"
          ? `${process.env.HOME}/Library/Application Support/${config.dirname}`
          : this.config.cacheDir,
      fs: FSNode,
      logger: {
        log: this.Log,
        start: this.LogStart,
        done: this.LogDone,
        success: this.LogSuccess,
        failure: this.LogFailure,
        stop: this.LogStop,
      },
    });
  }

  public async init(): Promise<void> {
    await super.init();
    const constructor = this.constructor as Interfaces.Command.Class;
    const { flags } = await this.parse(constructor);
    this.flags = flags;
  }

  protected async catch(err: Error & { exitCode?: number }): Promise<any> {
    return super.catch(err);
  }

  protected async finally(_: Error | undefined): Promise<any> {
    return super.finally(_);
  }

  private get _isDebug(): boolean {
    const logLevel = this.flags["log-level"];
    return logLevel === LogLevel.Debug;
  }

  private get _isInfo(): boolean {
    const logLevel = this.flags["log-level"];
    return logLevel === LogLevel.Debug || logLevel === LogLevel.Info;
  }

  private get _isWarning(): boolean {
    const logLevel = this.flags["log-level"];
    return logLevel !== LogLevel.Error;
  }

  protected Log = (message: string): void => {
    if (this.flags.verbose && this._isInfo) {
      this.log(TE.dim(message));
    }
  };

  protected LogStart = (message: string): void => {
    if (this.flags.verbose && this._isInfo) {
      CliUx.ux.action.start(TE.dim(message));
    }
  };

  protected LogDone = (message = "done"): void => {
    if (this.flags.verbose && this._isInfo) {
      CliUx.ux.action.stop(TE.dim(message));
    }
  };

  protected LogSuccess = (): void => this.LogDone("✓");

  protected LogFailure = (): void => this.LogDone("✗");

  protected LogStop = (): void => this.LogDone("interrupted");

  protected Debug = (message: string): void => {
    if (this._isDebug) {
      this.log(`${TE.b("Debug:")} ${message}`);
    }
  };

  protected Info = (message: string): void => {
    if (this._isInfo) {
      this.log(TE.info(message));
    }
  };

  protected Warn = (message: string): void => {
    if (this._isWarning) {
      this.log(TE.warning(message));
    }
  };

  protected Error = (
    message: string,
    exit: number,
    options: { suggestions?: string[]; ref?: string } = {},
  ): void => {
    this.error(message, {
      exit,
      suggestions: options.suggestions,
      ref: options.ref,
    });
  };
}
