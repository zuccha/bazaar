const SupportedTool = {
  addmusick: {
    name: "addmusick",
    displayName: "AddmusicK",
    downloadUrl: "https://dl.smwcentral.net/24994/AddmusicK_1.0.8.zip",
    supportedVersion: "1.0.8",
  },
  asar: {
    name: "asar",
    displayName: "Asar",
    downloadUrl: "https://dl.smwcentral.net/25953/asar181.zip",
    supportedVersion: "1.81",
  },
  flips: {
    name: "flips",
    displayName: "Flips",
    downloadUrl: "https://dl.smwcentral.net/11474/floating.zip",
    supportedVersion: "1.31",
  },
  gps: {
    name: "gps",
    displayName: "GPS",
    downloadUrl: "https://dl.smwcentral.net/31515/GPS%20%28V1.4.4%29.zip",
    supportedVersion: "1.4.4",
  },
  "lunar-magic": {
    name: "lunar-magic",
    displayName: "Lunar Magic",
    downloadUrl: "https://dl.smwcentral.net/32211/lm333.zip",
    supportedVersion: "3.33",
  },
  pixi: {
    name: "pixi",
    displayName: "PIXI",
    downloadUrl: "https://dl.smwcentral.net/26026/pixi_v1.32.zip",
    supportedVersion: "1.32",
  },
  uberasm: {
    name: "uberasm",
    displayName: "UberASM",
    downloadUrl: "https://dl.smwcentral.net/28974/UberASMTool15.zip",
    supportedVersion: "1.5",
  },
} as const;

export type SupportedToolName = keyof typeof SupportedTool;

export default SupportedTool;
