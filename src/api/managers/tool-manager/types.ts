export type Tool = {
  name: string;
  displayName: string;
  downloadUrl: string;
  version: string;
};

export type ToolInfo = {
  tool: Tool;
  status: "not-installed" | "installed" | "deprecated";
};
