import { Command } from "@oclif/core";
import ToolApi from "../../api/tool";

export default class ToolList extends Command {
  static description = "List tools and their installation status.";

  async run(): Promise<void> {
    // const { args, flags } = await this.parse(Tool);

    ToolApi.list().forEach((toolInfo) => {
      const line = `${toolInfo.tool.name} (${toolInfo.tool.version}) - ${toolInfo.status}`;
      this.log(line);
    });
  }
}
