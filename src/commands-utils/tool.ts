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

export const getTool = (
  toolCollection: ToolCollection,
  toolName: ToolName,
): Tool => {
  switch (toolName) {
    case ToolName.AddmusicK:
      return toolCollection.AddmusicK;
    case ToolName.Asar:
      return toolCollection.Asar;
    case ToolName.Flips:
      return toolCollection.Flips;
    case ToolName.GPS:
      return toolCollection.GPS;
    case ToolName.LunarMagic:
      return toolCollection.LunarMagic;
    case ToolName.PIXI:
      return toolCollection.PIXI;
    case ToolName.UberASMTool:
      return toolCollection.UberASMTool;
  }
};
