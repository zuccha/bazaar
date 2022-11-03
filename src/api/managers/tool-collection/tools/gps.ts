import Tool from "../tool";

export default class GPS extends Tool {
  protected readonly id = "GPS";

  readonly displayName = "GPS";
  protected readonly exeName = "gps.exe";
  protected downloadUrl =
    "https://dl.smwcentral.net/31515/GPS%20%28V1.4.4%29.zip";
  protected readonly supportedVersion = "1.4.4";
}
