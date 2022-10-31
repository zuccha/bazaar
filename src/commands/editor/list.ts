import { CliUx } from "@oclif/core";
import EditorManager from "../../api/managers/editor-manager";
import { Editor } from "../../api/managers/editor-manager/editor";
import { SupportedEditorName } from "../../api/managers/editor-manager/supported-editor";
import { R } from "../../api/utils/result";
import BaseCommand from "../../utils/base-command";
import TE from "../../utils/text-effect";

export default class EditorListCommand extends BaseCommand<
  typeof EditorListCommand
> {
  static summary = "List editors and their paths";
  static description = `\
List editors used by the program. Editors are programs chosen by the user used\
 to open certain types of files.

By default, editors will be opened running the following command:
$ \\path\\to\\editor.exe %1%
where \`%1%\` is the path to the resource that will be opened (e.g., ASM file).\
 You can customize the arguments used when running an editor:
$ bazaar editor set <editor-name> --args "--custom-flag %1%"

Supported editors are:
- ${TE.b("code-editor")}: Used to open ASM files and directories. Examples of\
 code editors include Notepad++, VS Code, and Sublime.
- ${TE.b("emulator")}: Used to run ROM hacks. Example of emulators include\
 Snes9x and RetroArch.

The difference between and editors and tools: editors are user-chosen programs,\
 while tools need to be of specific versions to ensure that they work correctly.\
 If you want to install tools instead, check out \`bazaar tool --help\`.`;

  static examples = ["bazaar editor list", "bazaar editor list emulator"];

  static args = [
    {
      name: "editor-name",
      required: false,
      description: "Name of the editor",
      options: EditorManager.EditorNames,
    },
  ];

  static flags = {
    ...CliUx.ux.table.flags(),
  };

  async run(): Promise<void> {
    const { args } = await this.parse(EditorListCommand);
    const editorName: SupportedEditorName | undefined = args["editor-name"];

    if (editorName) {
      const editorResult = await this.api.editor.list(editorName);
      if (R.isError(editorResult)) {
        const messages = R.messages(editorResult, { verbose: true });
        this.Error(`Failed to list ${editorName}\n${messages}`, 1);
        return;
      }

      this.logEditors([editorResult.data]);
    } else {
      const editorsResult = await this.api.editor.listAll();
      if (R.isError(editorsResult)) {
        const messages = R.messages(editorsResult, { verbose: true });
        this.Error(`Failed to list editors\n${messages}`, 1);
        return;
      }

      this.logEditors(editorsResult.data);
    }
  }

  logEditors(editors: Editor[]): void {
    for (const editor of editors) {
      this.log(TE.b(editor.name));
      this.log(`- Path: ${editor.config.exePath || TE.i("<not set>")}`);
      this.log(`- Args: ${editor.config.exeArgs}`);
    }
  }
}
