import Tool from "../tool";

export default class Flips extends Tool {
  protected readonly id = "Flips";

  readonly displayName = "Flips";
  protected readonly exeName = "flips.exe";
  protected readonly downloadUrl =
    "https://dl.smwcentral.net/11474/floating.zip";
  protected readonly supportedVersion = "1.31";
}
