import { Command, Config, Flags, Interfaces } from "@oclif/core";
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
      log: this.Log,
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

  protected Log = async (message: string): Promise<void> => {
    if (!this.flags.verbose) {
      return;
    }

    const logLevel = this.flags["log-level"];
    if (logLevel !== LogLevel.Debug && logLevel !== LogLevel.Info) {
      return;
    }

    this.log(TE.dim(message));
  };

  protected Debug = async (message: string): Promise<void> => {
    const logLevel = this.flags["log-level"];
    if (logLevel !== LogLevel.Debug) {
      return;
    }

    this.log(`${TE.b("Debug:")} ${message}`);
  };

  protected Info = async (message: string): Promise<void> => {
    const logLevel = this.flags["log-level"];
    if (logLevel !== LogLevel.Debug && logLevel !== LogLevel.Info) {
      return;
    }

    this.log(TE.info(message));
  };

  protected Warn = async (message: string): Promise<void> => {
    const logLevel = this.flags["log-level"];
    if (logLevel === LogLevel.Error) {
      return;
    }

    this.log(TE.warning(message));
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
