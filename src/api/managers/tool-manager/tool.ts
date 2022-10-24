export type Tool = {
  name: string;
  displayName: string;
  downloadUrl: string;
  supportedVersion: string;
  installedVersion: string | undefined;
  installationStatus: "not-installed" | "installed" | "deprecated";
};
