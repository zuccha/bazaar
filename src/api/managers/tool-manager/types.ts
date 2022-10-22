export type Tool = {
  name: string;
  displayName: string;
  downloadUrl: string;
  supportedVersion: string;
};

export type ToolInfo = {
  tool: Tool;
  status: "not-installed" | "installed" | "deprecated";
  installedVersion: string | undefined;
};
