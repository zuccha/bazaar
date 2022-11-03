import Tool from "../tool";

export default class UberASMTool extends Tool {
  protected readonly id = "UberASMTool";

  readonly displayName = "UberASMTool";
  protected readonly exeName = "UberASMTool.exe";
  protected readonly downloadUrl =
    "https://dl.smwcentral.net/28974/UberASMTool15.zip";
  protected readonly supportedVersion = "1.5";
}
