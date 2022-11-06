import { CliUx } from "@oclif/core";
import { EditorInfo } from "../../api/managers/editor-collection/editor";
import { R } from "../../api/utils/result";
import { EditorName, getEditor } from "../../commands-utils/editor";
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
      options: Object.values(EditorName),
    },
  ];

  static flags = {
    ...CliUx.ux.table.flags(),
  };

  async run(): Promise<void> {
    const { args } = await this.parse(EditorListCommand);
    const editorName: EditorName | undefined = args["editor-name"];

    if (editorName) {
      this.Verbose.start(`Gathering editor info`);
      const editorInfoResult = await getEditor(
        this.api.editors,
        editorName,
      ).list();
      if (R.isError(editorInfoResult)) {
        this.Verbose.failure();
        const messages = R.messages(editorInfoResult, { verbose: true });
        this.Error(`Failed to list ${editorName}\n${messages}`, 1);
        return;
      }
      this.Verbose.success();
      this.logEditorInfos([editorInfoResult.data]);
    } else {
      this.Verbose.start(`Gathering editors info`);
      const editorInfosResult = await this.api.editors.listAll();
      if (R.isError(editorInfosResult)) {
        this.Verbose.failure();
        const messages = R.messages(editorInfosResult, { verbose: true });
        this.Error(`Failed to list editors\n${messages}`, 1);
        return;
      }
      this.Verbose.success();
      this.logEditorInfos(editorInfosResult.data);
    }
  }

  logEditorInfos(editorInfos: EditorInfo[]): void {
    for (const editorInfo of editorInfos) {
      this.log(TE.b(editorInfo.name));
      this.log(`- Path: ${editorInfo.exePath || TE.i("<not set>")}`);
      this.log(`- Args: ${editorInfo.exeArgs}`);
    }
  }
}
