import { R, Result, ResultVoid } from "../../utils/result";
import Directory from "../directory";
import { ManagerContext } from "../manager";
import Tool, { ToolInfo } from "./tool";
import AddmusicK from "./tools/addmusick";
import Asar from "./tools/asar";
import Flips from "./tools/flips";
import GPS from "./tools/gps";
import LunarMagic from "./tools/lunar-magic";
import PIXI from "./tools/pixi";
import UberASMTool from "./tools/uberasmtool";

export enum ToolCollectionErrorCode {
  Internal,
}

export type ToolCollectionErrorCodes = {
  ListAll: ToolCollectionErrorCode.Internal;
  InstallAll: ToolCollectionErrorCode.Internal;
  UninstallAll: ToolCollectionErrorCode.Internal;
  UpdateAll: ToolCollectionErrorCode.Internal;
};

export default class ToolCollection extends Directory {
  protected id = "ToolCollection";

  readonly AddmusicK: AddmusicK;
  readonly Asar: Asar;
  readonly Flips: Flips;
  readonly GPS: GPS;
  readonly LunarMagic: LunarMagic;
  readonly PIXI: PIXI;
  readonly UberASMTool: UberASMTool;

  private readonly _tools: Tool[];

  constructor(directoryPath: string, context: ManagerContext) {
    super(directoryPath, context);

    this.AddmusicK = new AddmusicK(
      this.fs.join(directoryPath, "AddmusicK"),
      context,
    );
    this.Asar = new Asar(this.fs.join(directoryPath, "Asar"), context);
    this.Flips = new Flips(this.fs.join(directoryPath, "Flips"), context);
    this.GPS = new GPS(this.fs.join(directoryPath, "GPS"), context);
    this.LunarMagic = new LunarMagic(
      this.fs.join(directoryPath, "LunarMagic"),
      context,
    );
    this.PIXI = new PIXI(this.fs.join(directoryPath, "PIXI"), context);
    this.UberASMTool = new UberASMTool(
      this.fs.join(directoryPath, "UberASMTool"),
      context,
    );

    this._tools = [
      this.AddmusicK,
      this.Asar,
      this.Flips,
      this.GPS,
      this.LunarMagic,
      this.PIXI,
      this.UberASMTool,
    ];
  }

  async listAll(): Promise<
    Result<ToolInfo[], ToolCollectionErrorCodes["ListAll"]>
  > {
    const scope = this.scope("listAll");

    const tools: ToolInfo[] = [];

    for (const tool of this._tools) {
      this.logger.start(`Gathering ${tool.displayName} information`);
      const toolResult = await tool.list();
      if (R.isError(toolResult)) {
        this.logger.failure();
        const message = "Failed to gather data for tool";
        return R.Stack(
          toolResult,
          scope,
          message,
          ToolCollectionErrorCode.Internal,
        );
      }

      this.logger.success();
      tools.push(toolResult.data);
    }

    return R.Ok(tools);
  }

  async installAll(
    partialOptions?: Partial<{ force: boolean }>,
  ): Promise<ResultVoid<ToolCollectionErrorCodes["InstallAll"]>> {
    const scope = this.scope("installAll");

    const options = { force: false, ...partialOptions };

    for (const tool of this._tools) {
      this.logger.start(`Installing ${tool.displayName}`);
      const result = await tool.install({
        force: options.force,
        ignoreIfAlreadyInstalled: true,
      });
      if (R.isError(result)) {
        this.logger.failure();
        const message = "Failed to install all tools";
        return R.Stack(
          result,
          scope,
          message,
          ToolCollectionErrorCode.Internal,
        );
      }
      this.logger.success();
    }

    return R.Void;
  }

  async uninstallAll(): Promise<
    ResultVoid<ToolCollectionErrorCodes["UninstallAll"]>
  > {
    const scope = this.scope("uninstallAll");

    for (const tool of this._tools) {
      this.logger.start(`Uninstalling ${tool.displayName}`);
      const result = await tool.uninstall({ ignoreIfNotInstalled: true });
      if (R.isError(result)) {
        this.logger.failure();
        const message = "Failed to uninstall all tools";
        return R.Stack(
          result,
          scope,
          message,
          ToolCollectionErrorCode.Internal,
        );
      }
      this.logger.success();
    }

    return R.Void;
  }

  async updateAll(): Promise<
    ResultVoid<ToolCollectionErrorCodes["UpdateAll"]>
  > {
    const scope = this.scope("updateAll");

    for (const tool of this._tools) {
      this.logger.start(`Updating ${tool.displayName}`);
      const result = await tool.update({
        ignoreIfNotInstalled: true,
        ignoreIfUpToDate: true,
      });
      if (R.isError(result)) {
        this.logger.failure();
        const message = "Failed to update all tools";
        return R.Stack(
          result,
          scope,
          message,
          ToolCollectionErrorCode.Internal,
        );
      }
      this.logger.success();
    }

    return R.Void;
  }
}
