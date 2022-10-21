import { Command } from "@oclif/core";
import ToolApi from "../../api/tool";

export default class ToolList extends Command {
  static summary = "List tools and their installation status.";
  static description = `\
List tools and their installation status. A tool can be either not installed,\
 installed, or deprecated.
Deprecated tools might not work with the current version of Bazar and need to\
 be updated.`;

  async run(): Promise<void> {
    // const { args, flags } = await this.parse(Tool);

    ToolApi.list().forEach((toolInfo) => {
      const line = `${toolInfo.tool.name} (${toolInfo.tool.version}) - ${toolInfo.status}`;
      this.log(line);
    });
  }
}
