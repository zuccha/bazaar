import Tool from "../tool";

export default class PIXI extends Tool {
  protected readonly id = "PIXI";

  readonly displayName = "PIXI";
  protected readonly exeName = "pixi.exe";
  protected readonly downloadUrl =
    "https://dl.smwcentral.net/26026/pixi_v1.32.zip";
  protected readonly supportedVersion = "1.32";
}
