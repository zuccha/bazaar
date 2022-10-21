import { Command } from "@oclif/core";

export default class TemplatePatchRemove extends Command {
  static summary = "Remove a patch from the list of available templates.";
  static description =
    "Removing a patch from the list of available templates will not remove it from any project that used it.";

  static examples = [];

  async run(): Promise<void> {
    this.log("Not implemented");
  }
}
