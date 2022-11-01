import Tool from "../tool";

export default class Asar extends Tool {
  protected id = "tool.asar";

  protected displayName = "Asar";
  protected exeName = "asar.exe";
  protected downloadUrl = "https://dl.smwcentral.net/25953/asar181.zip";
  protected supportedVersion = "1.81";
}
