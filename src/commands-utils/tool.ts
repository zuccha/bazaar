import ToolCollection from "../api/managers/tool-collection";
import Tool from "../api/managers/tool-collection/tool";

export enum ToolName {
  AddmusicK = "addmusick",
  Asar = "asar",
  Flips = "flips",
  GPS = "gps",
  LunarMagic = "lunarmagic",
  PIXI = "pixi",
  UberASMTool = "uberasmtool",
}

export const getTool = (tools: ToolCollection, toolName: ToolName): Tool => {
  switch (toolName) {
    case ToolName.AddmusicK:
      return tools.AddmusicK;
    case ToolName.Asar:
      return tools.Asar;
    case ToolName.Flips:
      return tools.Flips;
    case ToolName.GPS:
      return tools.GPS;
    case ToolName.LunarMagic:
      return tools.LunarMagic;
    case ToolName.PIXI:
      return tools.PIXI;
    case ToolName.UberASMTool:
      return tools.UberASMTool;
  }
};
