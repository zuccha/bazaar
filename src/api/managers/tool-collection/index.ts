import { Logger } from "../../utils/logger";
import { ManagerBag } from "../../utils/manager";
import { R, Result, ResultVoid } from "../../utils/result";
import Tool, { ToolInfo } from "./tool";
import AddmusicK from "./tools/addmusick";
import Asar from "./tools/asar";
import Flips from "./tools/flips";
import GPS from "./tools/gps";
import LunarMagic from "./tools/lunar-magic";
import PIXI from "./tools/pixi";
import UberASMTool from "./tools/uberasmtool";

const ErrorCode = {
  Generic: "ToolCollection.Generic",
};

export default class ToolCollection {
  static ErrorCode = ErrorCode;

  private _logger: Logger;

  readonly AddmusicK: AddmusicK;
  readonly Asar: Asar;
  readonly Flips: Flips;
  readonly GPS: GPS;
  readonly LunarMagic: LunarMagic;
  readonly PIXI: PIXI;
  readonly UberASMTool: UberASMTool;

  private readonly _tools: Tool[];

  constructor(directoryPath: string, bag: ManagerBag) {
    const fs = bag.fs;
    this._logger = bag.logger;

    this.AddmusicK = new AddmusicK(fs.join(directoryPath, "AddmusicK"), bag);
    this.Asar = new Asar(fs.join(directoryPath, "Asar"), bag);
    this.Flips = new Flips(fs.join(directoryPath, "Flips"), bag);
    this.GPS = new GPS(fs.join(directoryPath, "GPS"), bag);
    this.LunarMagic = new LunarMagic(fs.join(directoryPath, "LunarMagic"), bag);
    this.PIXI = new PIXI(fs.join(directoryPath, "PIXI"), bag);
    this.UberASMTool = new UberASMTool(
      fs.join(directoryPath, "UberASMTool"),
      bag,
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

  protected scope(functionName: string): string {
    return `ToolCollection.${functionName}`;
  }

  async listAll(): Promise<Result<ToolInfo[]>> {
    const scope = this.scope("listAll");

    const tools: ToolInfo[] = [];

    for (const tool of this._tools) {
      const toolResult = await tool.list();

      if (R.isError(toolResult)) {
        this._logger.failure();
        const message = "Failed to gather data for tool";
        return R.Stack(toolResult, scope, message, ErrorCode.Generic);
      }

      tools.push(toolResult.data);
    }

    return R.Ok(tools);
  }

  async installAll(
    partialOptions?: Partial<{ force: boolean }>,
  ): Promise<ResultVoid> {
    const scope = this.scope("installAll");

    const options = { force: false, ...partialOptions };

    for (const tool of this._tools) {
      const result = await tool.install({
        force: options.force,
        ignoreIfAlreadyInstalled: true,
      });

      if (R.isError(result)) {
        const message = "Failed to install all tools";
        return R.Stack(result, scope, message, ErrorCode.Generic);
      }
    }

    return R.Void;
  }

  async uninstallAll(): Promise<ResultVoid> {
    const scope = this.scope("uninstallAll");

    for (const tool of this._tools) {
      const result = await tool.uninstall({ ignoreIfNotInstalled: true });

      if (R.isError(result)) {
        const message = "Failed to uninstall all tools";
        return R.Stack(result, scope, message, ErrorCode.Generic);
      }
    }

    return R.Void;
  }

  async updateAll(): Promise<ResultVoid> {
    const scope = this.scope("updateAll");

    for (const tool of this._tools) {
      const result = await tool.update({
        ignoreIfNotInstalled: true,
        ignoreIfUpToDate: true,
      });

      if (R.isError(result)) {
        const message = "Failed to update all tools";
        return R.Stack(result, scope, message, ErrorCode.Generic);
      }
    }

    return R.Void;
  }
}
