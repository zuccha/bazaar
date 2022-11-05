import { Flags } from "@oclif/core";
import { EditorErrorCode } from "../../api/managers/editor-collection/editor";
import { R } from "../../api/utils/result";
import { EditorName, getEditor } from "../../commands-utils/editor";
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
      options: Object.values(EditorName),
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
    const editorName: EditorName = args["editor-name"];

    this.Info.start(`Setting ${editorName} parameters`);
    const result = await getEditor(this.api.editors, editorName).set({
      ...(flags["exe-path"] ? { exePath: flags["exe-path"] } : {}),
      ...(flags["exe-args"] ? { exeArgs: flags["exe-args"] } : {}),
    });

    if (R.isOk(result)) {
      this.Info.success();
      return;
    }

    if (result.code === EditorErrorCode.MissingParameters) {
      this.Info.failure();
      const message =
        "No parameter was given, pass at least one of `--exe-path` or `--exe-args`";
      this.Warning.log(message);
      return;
    }

    if (result.code === EditorErrorCode.ExeNotFound) {
      this.Info.failure();
      const message =
        "The given exe file does not exist, please provide a valid exe file";
      this.Warning.log(message);
      return;
    }

    this.Info.failure();
    const messages = R.messages(result, { verbose: true });
    this.Error(`Failed to set ${editorName} properties\n${messages}`, 1);
  }
}
