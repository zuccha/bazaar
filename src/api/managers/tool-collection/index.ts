import { R, Result, ResultVoid } from "../../utils/result";
import DirectoryManager, { ManagerBag } from "../directory-manager";
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

export default class ToolCollection extends DirectoryManager {
  static ErrorCode = ErrorCode;

  protected id = "tool-collection";

  readonly AddmusicK: AddmusicK;
  readonly Asar: Asar;
  readonly Flips: Flips;
  readonly GPS: GPS;
  readonly LunarMagic: LunarMagic;
  readonly PIXI: PIXI;
  readonly UberASMTool: UberASMTool;

  private readonly _tools: Tool[];

  constructor(directoryPath: string, bag: ManagerBag) {
    super(directoryPath, bag);

    this.AddmusicK = new AddmusicK(
      this.fs.join(directoryPath, "AddmusicK"),
      bag,
    );
    this.Asar = new Asar(this.fs.join(directoryPath, "Asar"), bag);
    this.Flips = new Flips(this.fs.join(directoryPath, "Flips"), bag);
    this.GPS = new GPS(this.fs.join(directoryPath, "GPS"), bag);
    this.LunarMagic = new LunarMagic(
      this.fs.join(directoryPath, "LunarMagic"),
      bag,
    );
    this.PIXI = new PIXI(this.fs.join(directoryPath, "PIXI"), bag);
    this.UberASMTool = new UberASMTool(
      this.fs.join(directoryPath, "UberASMTool"),
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

  async listAll(): Promise<Result<ToolInfo[]>> {
    const scope = this.scope("listAll");

    const tools: ToolInfo[] = [];

    for (const tool of this._tools) {
      const toolResult = await tool.list();

      if (R.isError(toolResult)) {
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
