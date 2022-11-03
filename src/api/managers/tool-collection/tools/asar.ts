import Tool from "../tool";

export default class Asar extends Tool {
  protected readonly id = "Asar";

  readonly displayName = "Asar";
  protected readonly exeName = "asar.exe";
  protected readonly downloadUrl =
    "https://dl.smwcentral.net/25953/asar181.zip";
  protected readonly supportedVersion = "1.81";
}
