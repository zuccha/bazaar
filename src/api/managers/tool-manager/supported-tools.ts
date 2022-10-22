import { Tool } from "./types";

const supportedTools: Record<string, Tool> = {
  AddmusicK: {
    name: "AddmusicK",
    displayName: "AddmusicK",
    downloadUrl: "https://dl.smwcentral.net/24994/AddmusicK_1.0.8.zip",
    version: "1.0.8",
  },
  Asar: {
    name: "Asar",
    displayName: "Asar",
    version: "1.81",
    downloadUrl: "https://dl.smwcentral.net/25953/asar181.zip",
  },
  Flips: {
    name: "Flips",
    displayName: "Flips",
    downloadUrl: "https://dl.smwcentral.net/11474/floating.zip",
    version: "1.31",
  },
  GPS: {
    name: "GPS",
    displayName: "GPS",
    downloadUrl: "https://dl.smwcentral.net/31515/GPS%20%28V1.4.4%29.zip",
    version: "1.4.4",
  },
  LunarMagic: {
    name: "LunarMagic",
    displayName: "Lunar Magic",
    downloadUrl: "https://dl.smwcentral.net/32211/lm333.zip",
    version: "3.33",
  },
  PIXI: {
    name: "PIXI",
    displayName: "PIXI",
    downloadUrl: "https://dl.smwcentral.net/26026/pixi_v1.32.zip",
    version: "1.32",
  },
  UberASM: {
    name: "UberASM",
    displayName: "UberASM",
    downloadUrl: "https://dl.smwcentral.net/28974/UberASMTool15.zip",
    version: "1.5",
  },
} as const;

export default supportedTools;
