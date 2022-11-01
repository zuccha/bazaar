import Tool from "../tool";

export default class PIXI extends Tool {
  protected id = "tool.pixi";

  protected displayName = "PIXI";
  protected exeName = "pixi.exe";
  protected downloadUrl = "https://dl.smwcentral.net/26026/pixi_v1.32.zip";
  protected supportedVersion = "1.32";
}
