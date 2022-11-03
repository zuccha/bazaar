import { CliUx, Command, Config, Flags, Interfaces } from "@oclif/core";
import Api from "../api";
import { Logger } from "../api/utils/logger";
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
      logger: this.Verbose,
    });
  }

  public async init(): Promise<void> {
    await super.init();
    const constructor = this.constructor as Interfaces.Command.Class;
    const { flags } = await this.parse(constructor);
    this.flags = flags;
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

  private get _isVerbose(): boolean {
    const verbose = this.flags.verbose;
    return verbose && this._isInfo;
  }

  private _logs: string[] = [];
  private _lastLogOperation: "start" | "stop" = "stop";
  private _logDepth = 0;

  private _logPrefix = (depth: number): string => TE.dim("| ".repeat(depth));

  private _log = (message: string): void => {
    const prefix = this._logPrefix(this._logDepth);
    this.log(`${prefix}${message}`);
  };

  private _logStart = (message: string): void => {
    const prefix = this._logPrefix(this._logDepth++);
    this._logs.push(message);

    if (this._lastLogOperation === "start") CliUx.ux.action.stop("");
    CliUx.ux.action.start(`${prefix}${message}`);

    this._lastLogOperation = "start";
  };

  private _logStop = (message: string): void => {
    const prefix = this._logPrefix(--this._logDepth);
    const log = this._logs.pop();

    if (this._lastLogOperation === "stop")
      this.log(`${prefix}${log}... ${message}`);
    else CliUx.ux.action.stop(message);

    this._lastLogOperation = "stop";
  };

  private _createLogger = (
    transformText: (text: string) => string,
    isAbleToLog: () => boolean,
  ): Logger => {
    const log = (message: string): void => {
      if (isAbleToLog()) {
        this.log(transformText(message));
      }
    };

    const start = (message: string): void => {
      if (isAbleToLog()) {
        this._logStart(transformText(message));
      }
    };

    const done = (message = "done"): void => {
      if (isAbleToLog()) {
        this._logStop(transformText(message));
      }
    };

    const success = (): void => done("✓");
    const failure = (): void => done("✗");
    const stop = (): void => done("interrupted");

    return { log, start, done, success, failure, stop };
  };

  Verbose = this._createLogger(TE.dim, () => this._isVerbose);
  Debug = this._createLogger(TE.b, () => this._isDebug);
  Info = this._createLogger(TE.info, () => this._isInfo);
  Warning = this._createLogger(TE.warning, () => this._isWarning);

  protected Error = (
    message: string,
    exit: number,
    options?: Partial<{ suggestions: string[]; ref: string }>,
  ): void => {
    this.error(message, { ...options, exit });
  };
}
