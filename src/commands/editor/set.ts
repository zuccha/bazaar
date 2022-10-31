// import ToolApi from "../../api/managers/tool-manager";
import { CliUx, Flags } from "@oclif/core";
import EditorManager from "../../api/managers/editor-manager";
import { SupportedEditorName } from "../../api/managers/editor-manager/supported-editor";
import { R } from "../../api/utils/result";
import BaseCommand from "../../utils/base-command";
import TE from "../../utils/text-effect";

export default class EditorSetCommand extends BaseCommand<
  typeof EditorSetCommand
> {
  static summary = "Set editor executable and arguments";
  static description = `\
You can set the executable path and the flags passed to it when run. At least
one of \`--exe-path\` or \`--exe-args\` must be given.

Supported editors are:
- ${TE.b("code-editor")}: Used to open ASM files and directories. Examples of\
 code editors include Notepad++, VS Code, and Sublime.
- ${TE.b("emulator")}: Used to run ROM hacks. Example of emulators include\
 Snes9x and RetroArch.`;

  static examples = [
    'bazaar editor emulator set --exe-path="~\\tools\\snes9x\\snes9x.exe"',
    'bazaar editor emulator set --exe-path=""',
    'bazaar editor emulator set --exe-args="--no-volume %1%"',
    'bazaar editor code-editor set --exe-path="C:\\Program Files\\Notepad++\\Notepad++.exe" --exe-args="--reuse-window %1%"',
    'bazaar editor code-editor set --exe-path="C:\\Program Files\\Notepad++\\Notepad++.exe" --exe-args=""',
  ];

  static args = [
    {
      name: "editor-name",
      required: true,
      description: "Name of the editor",
      options: EditorManager.EditorNames,
    },
  ];

  static flags = {
    "exe-path": Flags.string({
      summary: "Path to the executable",
      description:
        'This must be a valid path. You can pass "" to unset the editor.',
      required: false,
    }),
    "exe-args": Flags.string({
      summary: "Arguments used when running the executable",
      description:
        '"%1%" is a placeholder for the resource to be opened. Passing "" will restore the default arguments.',
      required: false,
    }),
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(EditorSetCommand);
    const editorName: SupportedEditorName = args["editor-name"];

    CliUx.ux.action.start(`Setting ${editorName} parameters`);
    const result = await this.api.editor.set(editorName, {
      exePath: flags["exe-path"],
      exeArgs: flags["exe-args"],
    });

    if (R.isOk(result)) {
      CliUx.ux.action.stop();
      return;
    }

    if (result.code === EditorManager.ErrorCode.MissingParameters) {
      this.Warn(
        "No parameter was given, pass at least one of `--exe-path` or `--exe-args`",
      );
      CliUx.ux.action.stop("interrupted");
      return;
    }

    if (result.code === EditorManager.ErrorCode.ExeFileNotFound) {
      this.Warn(
        "The given exe file does not exist, please provide a valid exe file",
      );
      CliUx.ux.action.stop("interrupted");
      return;
    }

    const messages = R.messages(result, { verbose: true });
    this.Error(`Failed to set ${editorName} properties\n${messages}`, 1);
  }
}
