import Tool from "../tool";

export default class GPS extends Tool {
  protected id = "GPS";

  protected displayName = "GPS";
  protected exeName = "gps.exe";
  protected downloadUrl =
    "https://dl.smwcentral.net/31515/GPS%20%28V1.4.4%29.zip";
  protected supportedVersion = "1.4.4";
}
