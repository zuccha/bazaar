const SupportedTool = {
  addmusick: {
    name: "addmusick",
    displayName: "AddmusicK",
    exeName: "AddmusicK.exe",
    downloadUrl: "https://dl.smwcentral.net/24994/AddmusicK_1.0.8.zip",
    supportedVersion: "1.0.8",
  },
  asar: {
    name: "asar",
    displayName: "Asar",
    exeName: "asar.exe",
    downloadUrl: "https://dl.smwcentral.net/25953/asar181.zip",
    supportedVersion: "1.81",
  },
  flips: {
    name: "flips",
    displayName: "Flips",
    exeName: "flips.exe",
    downloadUrl: "https://dl.smwcentral.net/11474/floating.zip",
    supportedVersion: "1.31",
  },
  gps: {
    name: "gps",
    displayName: "GPS",
    exeName: "gps.exe",
    downloadUrl: "https://dl.smwcentral.net/31515/GPS%20%28V1.4.4%29.zip",
    supportedVersion: "1.4.4",
  },
  "lunar-magic": {
    name: "lunar-magic",
    displayName: "Lunar Magic",
    exeName: "Lunar Magic.exe",
    downloadUrl: "https://dl.smwcentral.net/32211/lm333.zip",
    supportedVersion: "3.33",
  },
  pixi: {
    name: "pixi",
    displayName: "PIXI",
    exeName: "pixi.exe",
    downloadUrl: "https://dl.smwcentral.net/26026/pixi_v1.32.zip",
    supportedVersion: "1.32",
  },
  uberasm: {
    name: "uberasm",
    displayName: "UberASM",
    exeName: "UberASMTool.exe",
    downloadUrl: "https://dl.smwcentral.net/28974/UberASMTool15.zip",
    supportedVersion: "1.5",
  },
} as const;

export type SupportedToolName = keyof typeof SupportedTool;

export const SupportedTools = Object.values(SupportedTool);

export default SupportedTool;
