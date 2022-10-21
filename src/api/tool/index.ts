type Tool = {
  name: string;
  displayName: string;
  downloadUrl: string;
  version: string;
};

type ToolInfo = {
  tool: Tool;
  status: "not-installed" | "installed" | "deprecated";
};

// TODO: Add all supported tools.
const supportedTools: Record<string, Tool> = {
  LunarMagic: {
    name: "LunarMagic",
    displayName: "Lunar Magic",
    downloadUrl: "https://dl.smwcentral.net/32211/lm333.zip",
    version: "3.33",
  },
} as const;

const ToolApi = {
  list: (): ToolInfo[] => {
    // TODO: Read the installed tools from filesystem.
    return Object.values(supportedTools).map((tool) => ({
      tool,
      status: "not-installed",
    }));
  },
};

export default ToolApi;
