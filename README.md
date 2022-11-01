# oclif-hello-world

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [oclif-hello-world](#oclif-hello-world)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g bazaar-cli
$ bazaar-cli COMMAND
running command...
$ bazaar-cli (--version)
bazaar-cli/0.0.0 darwin-arm64 node-v16.18.0
$ bazaar-cli --help [COMMAND]
USAGE
  $ bazaar-cli COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`bazaar-cli editor list [EDITOR-NAME]`](#bazaar-cli-editor-list-editor-name)
* [`bazaar-cli editor set EDITOR-NAME`](#bazaar-cli-editor-set-editor-name)
* [`bazaar-cli help [COMMAND]`](#bazaar-cli-help-command)
* [`bazaar-cli original-rom add`](#bazaar-cli-original-rom-add)
* [`bazaar-cli original-rom list`](#bazaar-cli-original-rom-list)
* [`bazaar-cli original-rom remove`](#bazaar-cli-original-rom-remove)
* [`bazaar-cli plugins`](#bazaar-cli-plugins)
* [`bazaar-cli plugins:install PLUGIN...`](#bazaar-cli-pluginsinstall-plugin)
* [`bazaar-cli plugins:inspect PLUGIN...`](#bazaar-cli-pluginsinspect-plugin)
* [`bazaar-cli plugins:install PLUGIN...`](#bazaar-cli-pluginsinstall-plugin-1)
* [`bazaar-cli plugins:link PLUGIN`](#bazaar-cli-pluginslink-plugin)
* [`bazaar-cli plugins:uninstall PLUGIN...`](#bazaar-cli-pluginsuninstall-plugin)
* [`bazaar-cli plugins:uninstall PLUGIN...`](#bazaar-cli-pluginsuninstall-plugin-1)
* [`bazaar-cli plugins:uninstall PLUGIN...`](#bazaar-cli-pluginsuninstall-plugin-2)
* [`bazaar-cli plugins update`](#bazaar-cli-plugins-update)
* [`bazaar-cli project backup create`](#bazaar-cli-project-backup-create)
* [`bazaar-cli project backup list`](#bazaar-cli-project-backup-list)
* [`bazaar-cli project backup restore`](#bazaar-cli-project-backup-restore)
* [`bazaar-cli project block add-from-file`](#bazaar-cli-project-block-add-from-file)
* [`bazaar-cli project block add-from-template`](#bazaar-cli-project-block-add-from-template)
* [`bazaar-cli project block apply-all`](#bazaar-cli-project-block-apply-all)
* [`bazaar-cli project block edit`](#bazaar-cli-project-block-edit)
* [`bazaar-cli project block list`](#bazaar-cli-project-block-list)
* [`bazaar-cli project block open`](#bazaar-cli-project-block-open)
* [`bazaar-cli project block remove`](#bazaar-cli-project-block-remove)
* [`bazaar-cli project block save-as-template`](#bazaar-cli-project-block-save-as-template)
* [`bazaar-cli project create-from-baserom`](#bazaar-cli-project-create-from-baserom)
* [`bazaar-cli project create-from-template`](#bazaar-cli-project-create-from-template)
* [`bazaar-cli project credits list`](#bazaar-cli-project-credits-list)
* [`bazaar-cli project meta edit`](#bazaar-cli-project-meta-edit)
* [`bazaar-cli project meta increase-major-version`](#bazaar-cli-project-meta-increase-major-version)
* [`bazaar-cli project meta increase-minor-version`](#bazaar-cli-project-meta-increase-minor-version)
* [`bazaar-cli project meta increase-patch-version`](#bazaar-cli-project-meta-increase-patch-version)
* [`bazaar-cli project meta list`](#bazaar-cli-project-meta-list)
* [`bazaar-cli project music add-from-file`](#bazaar-cli-project-music-add-from-file)
* [`bazaar-cli project music add-from-template`](#bazaar-cli-project-music-add-from-template)
* [`bazaar-cli project music apply-all`](#bazaar-cli-project-music-apply-all)
* [`bazaar-cli project music edit`](#bazaar-cli-project-music-edit)
* [`bazaar-cli project music list`](#bazaar-cli-project-music-list)
* [`bazaar-cli project music open`](#bazaar-cli-project-music-open)
* [`bazaar-cli project music remove`](#bazaar-cli-project-music-remove)
* [`bazaar-cli project music save-as-template`](#bazaar-cli-project-music-save-as-template)
* [`bazaar-cli project open-code-editor`](#bazaar-cli-project-open-code-editor)
* [`bazaar-cli project open-emulator`](#bazaar-cli-project-open-emulator)
* [`bazaar-cli project open-lunar-magic`](#bazaar-cli-project-open-lunar-magic)
* [`bazaar-cli project patch add-from-directory`](#bazaar-cli-project-patch-add-from-directory)
* [`bazaar-cli project patch add-from-file`](#bazaar-cli-project-patch-add-from-file)
* [`bazaar-cli project patch add-from-template`](#bazaar-cli-project-patch-add-from-template)
* [`bazaar-cli project patch apply`](#bazaar-cli-project-patch-apply)
* [`bazaar-cli project patch apply-all`](#bazaar-cli-project-patch-apply-all)
* [`bazaar-cli project patch edit`](#bazaar-cli-project-patch-edit)
* [`bazaar-cli project patch list`](#bazaar-cli-project-patch-list)
* [`bazaar-cli project patch open-directory`](#bazaar-cli-project-patch-open-directory)
* [`bazaar-cli project patch open-entry-file`](#bazaar-cli-project-patch-open-entry-file)
* [`bazaar-cli project patch remove`](#bazaar-cli-project-patch-remove)
* [`bazaar-cli project patch save-as-template`](#bazaar-cli-project-patch-save-as-template)
* [`bazaar-cli project release create`](#bazaar-cli-project-release-create)
* [`bazaar-cli project release list`](#bazaar-cli-project-release-list)
* [`bazaar-cli project release remove`](#bazaar-cli-project-release-remove)
* [`bazaar-cli project save-as-template`](#bazaar-cli-project-save-as-template)
* [`bazaar-cli project sprite add-from-file`](#bazaar-cli-project-sprite-add-from-file)
* [`bazaar-cli project sprite add-from-template`](#bazaar-cli-project-sprite-add-from-template)
* [`bazaar-cli project sprite apply-all`](#bazaar-cli-project-sprite-apply-all)
* [`bazaar-cli project sprite edit`](#bazaar-cli-project-sprite-edit)
* [`bazaar-cli project sprite list`](#bazaar-cli-project-sprite-list)
* [`bazaar-cli project sprite open`](#bazaar-cli-project-sprite-open)
* [`bazaar-cli project sprite remove`](#bazaar-cli-project-sprite-remove)
* [`bazaar-cli project sprite save-as-template`](#bazaar-cli-project-sprite-save-as-template)
* [`bazaar-cli project uber-asm add-from-directory`](#bazaar-cli-project-uber-asm-add-from-directory)
* [`bazaar-cli project uber-asm add-from-template`](#bazaar-cli-project-uber-asm-add-from-template)
* [`bazaar-cli project uber-asm apply`](#bazaar-cli-project-uber-asm-apply)
* [`bazaar-cli project uber-asm apply-all`](#bazaar-cli-project-uber-asm-apply-all)
* [`bazaar-cli project uber-asm edit`](#bazaar-cli-project-uber-asm-edit)
* [`bazaar-cli project uber-asm list`](#bazaar-cli-project-uber-asm-list)
* [`bazaar-cli project uber-asm open`](#bazaar-cli-project-uber-asm-open)
* [`bazaar-cli project uber-asm remove`](#bazaar-cli-project-uber-asm-remove)
* [`bazaar-cli project uber-asm save-as-template`](#bazaar-cli-project-uber-asm-save-as-template)
* [`bazaar-cli template block add`](#bazaar-cli-template-block-add)
* [`bazaar-cli template block edit`](#bazaar-cli-template-block-edit)
* [`bazaar-cli template block remove`](#bazaar-cli-template-block-remove)
* [`bazaar-cli template music add`](#bazaar-cli-template-music-add)
* [`bazaar-cli template music edit`](#bazaar-cli-template-music-edit)
* [`bazaar-cli template music remove`](#bazaar-cli-template-music-remove)
* [`bazaar-cli template patch add`](#bazaar-cli-template-patch-add)
* [`bazaar-cli template patch edit`](#bazaar-cli-template-patch-edit)
* [`bazaar-cli template patch remove`](#bazaar-cli-template-patch-remove)
* [`bazaar-cli template project add`](#bazaar-cli-template-project-add)
* [`bazaar-cli template project edit`](#bazaar-cli-template-project-edit)
* [`bazaar-cli template project remove`](#bazaar-cli-template-project-remove)
* [`bazaar-cli template sprite add`](#bazaar-cli-template-sprite-add)
* [`bazaar-cli template sprite edit`](#bazaar-cli-template-sprite-edit)
* [`bazaar-cli template sprite remove`](#bazaar-cli-template-sprite-remove)
* [`bazaar-cli template uber-asm add`](#bazaar-cli-template-uber-asm-add)
* [`bazaar-cli template uber-asm edit`](#bazaar-cli-template-uber-asm-edit)
* [`bazaar-cli template uber-asm remove`](#bazaar-cli-template-uber-asm-remove)
* [`bazaar-cli tool install TOOL-NAME`](#bazaar-cli-tool-install-tool-name)
* [`bazaar-cli tool install-all`](#bazaar-cli-tool-install-all)
* [`bazaar-cli tool list [TOOL-NAME]`](#bazaar-cli-tool-list-tool-name)
* [`bazaar-cli tool uninstall TOOL-NAME`](#bazaar-cli-tool-uninstall-tool-name)
* [`bazaar-cli tool uninstall-all`](#bazaar-cli-tool-uninstall-all)
* [`bazaar-cli tool update TOOL-NAME`](#bazaar-cli-tool-update-tool-name)
* [`bazaar-cli tool update-all`](#bazaar-cli-tool-update-all)

## `bazaar-cli editor list [EDITOR-NAME]`

List editors and their paths

```
USAGE
  $ bazaar-cli editor list [EDITOR-NAME] [--log-level debug|info|warn|error] [--verbose] [--columns <value> | -x]
    [--sort <value>] [--filter <value>] [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

ARGUMENTS
  EDITOR-NAME  (code-editor|emulator) Name of the editor

FLAGS
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

GLOBAL FLAGS
  --log-level=(debug|info|warn|error)  [default: info] Specify level for logging
  --verbose                            Produce more logs (info level)

DESCRIPTION
  List editors and their paths

  List editors used by the program. Editors are programs chosen by the user used to open certain types of files.

  By default, editors will be opened running the following command:
  $ \path\to\editor.exe %1%
  where `%1%` is the path to the resource that will be opened (e.g., ASM file). You can customize the arguments used
  when running an editor:
  $ bazaar editor set <editor-name> --args "--custom-flag %1%"

  Supported editors are:
  - code-editor: Used to open ASM files and directories. Examples of code editors include Notepad++, VS Code, and
  Sublime.
  - emulator: Used to run ROM hacks. Example of emulators include Snes9x and RetroArch.

  The difference between and editors and tools: editors are user-chosen programs, while tools need to be of specific
  versions to ensure that they work correctly. If you want to install tools instead, check out `bazaar tool --help`.

EXAMPLES
  bazaar editor list

  bazaar editor list emulator
```

## `bazaar-cli editor set EDITOR-NAME`

Set editor executable and arguments

```
USAGE
  $ bazaar-cli editor set [EDITOR-NAME] [--log-level debug|info|warn|error] [--verbose] [--exe-path <value>]
    [--exe-args <value>]

ARGUMENTS
  EDITOR-NAME  (code-editor|emulator) Name of the editor

FLAGS
  --exe-args=<value>  Arguments used when running the executable
  --exe-path=<value>  Path to the executable

GLOBAL FLAGS
  --log-level=(debug|info|warn|error)  [default: info] Specify level for logging
  --verbose                            Produce more logs (info level)

DESCRIPTION
  Set editor executable and arguments

  You can set the executable path and the flags passed to it when run. At least
  one of `--exe-path` or `--exe-args` must be given.

  Supported editors are:
  - code-editor: Used to open ASM files and directories. Examples of code editors include Notepad++, VS Code, and
  Sublime.
  - emulator: Used to run ROM hacks. Example of emulators include Snes9x and RetroArch.

EXAMPLES
  bazaar editor emulator set --exe-path="~\tools\snes9x\snes9x.exe"

  bazaar editor emulator set --exe-path=""

  bazaar editor emulator set --exe-args="--no-volume %1%"

  bazaar editor code-editor set --exe-path="C:\Program Files\Notepad++\Notepad++.exe" --exe-args="--reuse-window %1%"

  bazaar editor code-editor set --exe-path="C:\Program Files\Notepad++\Notepad++.exe" --exe-args=""

FLAG DESCRIPTIONS
  --exe-args=<value>  Arguments used when running the executable

    "%1%" is a placeholder for the resource to be opened. Passing "" will restore the default arguments.

  --exe-path=<value>  Path to the executable

    This must be a valid path. You can pass "" to unset the editor.
```

## `bazaar-cli help [COMMAND]`

Display help for bazaar-cli.

```
USAGE
  $ bazaar-cli help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for bazaar-cli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.15/src/commands/help.ts)_

## `bazaar-cli original-rom add`

Set the original vanilla ROM of SMW

```
USAGE
  $ bazaar-cli original-rom add --path <value> [--log-level debug|info|warn|error] [--verbose]

FLAGS
  --path=<value>  (required) Path to the copy of the original SMW ROM

GLOBAL FLAGS
  --log-level=(debug|info|warn|error)  [default: info] Specify level for logging
  --verbose                            Produce more logs (info level)

DESCRIPTION
  Set the original vanilla ROM of SMW

  The original ROM should be an unmodified ".sfc" file of vanilla Super Mario World.

  The file provided will be copied and saved in Bazaar's cache. This will ensure no accidental changes will be made to
  the original file.

  The original ROM is used to generate BPS files.

  Adding the original ROM a second time will overwrite any version previously added.

  The command will fail if an invalid file is provided.

EXAMPLES
  bazaar original-rom add --path="~\smw\vanilla-smw.sfc"

FLAG DESCRIPTIONS
  --path=<value>  Path to the copy of the original SMW ROM

    The file must be a valid, unmodified copy of SMW.
```

## `bazaar-cli original-rom list`

Show the path to the original ROM

```
USAGE
  $ bazaar-cli original-rom list [--log-level debug|info|warn|error] [--verbose]

GLOBAL FLAGS
  --log-level=(debug|info|warn|error)  [default: info] Specify level for logging
  --verbose                            Produce more logs (info level)

DESCRIPTION
  Show the path to the original ROM

  The original ROM should be an unmodified ".sfc" file of vanilla Super Mario World.

  The original ROM is used to generate BPS files.

EXAMPLES
  bazaar original-rom list
```

## `bazaar-cli original-rom remove`

Remove the copy of the original vanilla ROM of SMW

```
USAGE
  $ bazaar-cli original-rom remove [--log-level debug|info|warn|error] [--verbose]

GLOBAL FLAGS
  --log-level=(debug|info|warn|error)  [default: info] Specify level for logging
  --verbose                            Produce more logs (info level)

DESCRIPTION
  Remove the copy of the original vanilla ROM of SMW

  Removing the original ROM from Bazaar will not remove the file used to add it.

  Attempting to remove the original ROM if none was added will result in an error.

EXAMPLES
  bazaar original-rom remove
```

## `bazaar-cli plugins`

List installed plugins.

```
USAGE
  $ bazaar-cli plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ bazaar-cli plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.1.2/src/commands/plugins/index.ts)_

## `bazaar-cli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ bazaar-cli plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ bazaar-cli plugins add

EXAMPLES
  $ bazaar-cli plugins:install myplugin 

  $ bazaar-cli plugins:install https://github.com/someuser/someplugin

  $ bazaar-cli plugins:install someuser/someplugin
```

## `bazaar-cli plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ bazaar-cli plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ bazaar-cli plugins:inspect myplugin
```

## `bazaar-cli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ bazaar-cli plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ bazaar-cli plugins add

EXAMPLES
  $ bazaar-cli plugins:install myplugin 

  $ bazaar-cli plugins:install https://github.com/someuser/someplugin

  $ bazaar-cli plugins:install someuser/someplugin
```

## `bazaar-cli plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ bazaar-cli plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ bazaar-cli plugins:link myplugin
```

## `bazaar-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ bazaar-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ bazaar-cli plugins unlink
  $ bazaar-cli plugins remove
```

## `bazaar-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ bazaar-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ bazaar-cli plugins unlink
  $ bazaar-cli plugins remove
```

## `bazaar-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ bazaar-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ bazaar-cli plugins unlink
  $ bazaar-cli plugins remove
```

## `bazaar-cli plugins update`

Update installed plugins.

```
USAGE
  $ bazaar-cli plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

## `bazaar-cli project backup create`

Create a backup of the current project.

```
USAGE
  $ bazaar-cli project backup create

DESCRIPTION
  Create a backup of the current project.

  A backup consists of all resources of a project (blocks, music, patches, sprites, and UberASM code), the baserom, and
  meta information (authors, version).

  A backup does not include releases.
```

## `bazaar-cli project backup list`

List all backups performed on the current project.

```
USAGE
  $ bazaar-cli project backup list

DESCRIPTION
  List all backups performed on the current project.

  A backup consists of all resources of a project (blocks, music, patches,   sprites, and UberASM code), the baserom,
  and meta information (authors,   version).

  A backup does not include releases.
```

## `bazaar-cli project backup restore`

Restore a backup of the current project.

```
USAGE
  $ bazaar-cli project backup restore

DESCRIPTION
  Restore a backup of the current project.

  N.B.: This action is not reversible!

  A backup consists of all resources of a project (blocks, music, patches, sprites, and UberASM code), the baserom, and
  meta information (authors, version).

  A backup does not include releases.
```

## `bazaar-cli project block add-from-file`

Add a block to the project from an ASM file.

```
USAGE
  $ bazaar-cli project block add-from-file

DESCRIPTION
  Add a block to the project from an ASM file.

  Adding a block to the project will not insert it automatically into the ROM hack.
```

## `bazaar-cli project block add-from-template`

Add a block to the project from an template.

```
USAGE
  $ bazaar-cli project block add-from-template

DESCRIPTION
  Add a block to the project from an template.

  Adding a block to the project will not insert it automatically into the ROM hack.
```

## `bazaar-cli project block apply-all`

Insert all blocks into the ROM.

```
USAGE
  $ bazaar-cli project block apply-all

DESCRIPTION
  Insert all blocks into the ROM.

  Insert all blocks added to the project into the ROM hack via GPS.
```

## `bazaar-cli project block edit`

Edit the properties of a block.

```
USAGE
  $ bazaar-cli project block edit

DESCRIPTION
  Edit the properties of a block.

  After editing the block, the new changes will not automatically be inserted in the ROM hack.
```

## `bazaar-cli project block list`

List all blocks added to the project.

```
USAGE
  $ bazaar-cli project block list

DESCRIPTION
  List all blocks added to the project.

  Blocks consist of a single ASM code file, an id (hex number), and an act-as number.
  Blocks are inserted into the ROM hack via GPS.
```

## `bazaar-cli project block open`

Open the ASM file of the given block into the code editor.

```
USAGE
  $ bazaar-cli project block open

DESCRIPTION
  Open the ASM file of the given block into the code editor.

  If no code editor is set, this command will fail.
```

## `bazaar-cli project block remove`

Remove a given block from the current project.

```
USAGE
  $ bazaar-cli project block remove

DESCRIPTION
  Remove a given block from the current project.

  Removing a block from a project will not automatically remove it from the ROM hack.
```

## `bazaar-cli project block save-as-template`

Save a given block as a template.

```
USAGE
  $ bazaar-cli project block save-as-template

DESCRIPTION
  Save a given block as a template.

  Saving a block as a template means it can be used later to add the same block  to a different project.

  Saving a block as a template includes its ASM file, id, and save-as numbers.
```

## `bazaar-cli project create-from-baserom`

Create a new project starting from a baserom

```
USAGE
  $ bazaar-cli project create-from-baserom --baserom <value> --name <value> [--log-level debug|info|warn|error] [--verbose]
    [--author <value>] [--version <value>] [--path <value>]

FLAGS
  --author=<value>...  Author of the hack
  --baserom=<value>    (required) Path to the baserom
  --name=<value>       (required) Name of the project
  --path=<value>       [default: .] Directory where the project will be created
  --version=<value>    Initial version of the project

GLOBAL FLAGS
  --log-level=(debug|info|warn|error)  [default: info] Specify level for logging
  --verbose                            Produce more logs (info level)

DESCRIPTION
  Create a new project starting from a baserom

  The project will contain only the baserom (no patches, blocks, etc.).

  The new project will be created in a new directory named after the project, in the current directory.

EXAMPLES
  bazaar project create-from-baserom --name=test-hack --baserom=~\vanilla-smw.smc

  bazaar project create-from-baserom --name=test-hack --baserom=~\vanilla-smw.smc --path=..

  bazaar project create-from-baserom --name=test-hack --baserom=~\vanilla-smw.smc --author=zuccha --author=john.doe

  bazaar project create-from-baserom --name=test-hack --baserom=~\vanilla-smw.smc --author=zuccha --version=0.1.0

FLAG DESCRIPTIONS
  --author=<value>...  Author of the hack

    You can specify authors several times.

  --baserom=<value>  Path to the baserom

    The baserom must be a working smc ROM. This must be a valid path.

  --name=<value>  Name of the project

    The name will be used to create a directory inside the chosen <path>.

  --path=<value>  Directory where the project will be created

    The project folder will be "<path>\<name>".

  --version=<value>  Initial version of the project

    There is no restriction on what the version can be.
```

## `bazaar-cli project create-from-template`

Create a project from a template.

```
USAGE
  $ bazaar-cli project create-from-template

DESCRIPTION
  Create a project from a template.

  Create a project based on a previously saved template, including all itspatches, blocks, ...

  A project template can be created by saving an already existing project as a template.
  The new project will be created in a new directory named after the project, in the current directory.
```

## `bazaar-cli project credits list`

List all people that contributed to the ROM hack.

```
USAGE
  $ bazaar-cli project credits list

DESCRIPTION
  List all people that contributed to the ROM hack.

  Credits consist of the authors of the hack, tools used, and the resources (blocks, music, patches, sprites, and
  UberAsm code) added to the project.

  In addition to those, this will also include any extra credits specified in a CREDITS.txt file present in the root of
  the project.
```

## `bazaar-cli project meta edit`

Edit the properties of the current project.

```
USAGE
  $ bazaar-cli project meta edit

DESCRIPTION
  Edit the properties of the current project.

  The properties include name, authors, and version.
```

## `bazaar-cli project meta increase-major-version`

Increase the major version of the project.

```
USAGE
  $ bazaar-cli project meta increase-major-version

DESCRIPTION
  Increase the major version of the project.

  Increase the major version of the project by 1, and set the minor and patch versions to 0.

  This only works if the version is expressed following the SemVer convention (i.e., "major.minor.patch", "major.minor",
  "major"). For instance, the following values are supported:
  1.0.6 -> 2.0.0
  0.0.3 -> 1.0.0
  2.1   -> 3.0
  13    -> 14
  while these are not:
  v12.2
  FINAL VERSION
  1-alpha
```

## `bazaar-cli project meta increase-minor-version`

Increase the minor version of the project.

```
USAGE
  $ bazaar-cli project meta increase-minor-version

DESCRIPTION
  Increase the minor version of the project.

  Increase the minor version of the project by 1, and set the patch version to 0.

  This only works if the version is expressed following the SemVer convention up to the minor (i.e.,
  "major.minor.patch", "major.minor"). For instance, the following values are supported:
  1.0.6 -> 1.1.0
  0.0.3 -> 0.1.0
  2.1   -> 2.2
  while these are not:
  13
  v12.2
  FINAL VERSION
  1-alpha
```

## `bazaar-cli project meta increase-patch-version`

Increase the patch version of the project.

```
USAGE
  $ bazaar-cli project meta increase-patch-version

DESCRIPTION
  Increase the patch version of the project.

  Increase the patch version of the project by 1.

  This only works if the version is expressed following the SemVer convention up to the patch (i.e.,
  "major.minor.patch"). For instance, the following values are supported:
  1.0.6 -> 1.0.7
  0.0.9 -> 0.0.10
  while these are not:
  13
  2.1
  v12.2
  FINAL VERSION
  1-alpha
```

## `bazaar-cli project meta list`

List meta data of the current project.

```
USAGE
  $ bazaar-cli project meta list

DESCRIPTION
  List meta data of the current project.

  The meta data consist of the name, authors, and version.
```

## `bazaar-cli project music add-from-file`

Add a music track to the project.

```
USAGE
  $ bazaar-cli project music add-from-file

DESCRIPTION
  Add a music track to the project.

  Adding a music track to the project will not insert it automatically into the ROM hack.
```

## `bazaar-cli project music add-from-template`

Add a music track to the project from an template.

```
USAGE
  $ bazaar-cli project music add-from-template

DESCRIPTION
  Add a music track to the project from an template.

  Adding a music track to the project will not insert it automatically into the ROM hack.
```

## `bazaar-cli project music apply-all`

Insert all music tracks into the ROM.

```
USAGE
  $ bazaar-cli project music apply-all

DESCRIPTION
  Insert all music tracks into the ROM.

  Insert all music tracks added to the project into the ROM hack via AddmusicK.
```

## `bazaar-cli project music edit`

Edit the properties of a music track.

```
USAGE
  $ bazaar-cli project music edit

DESCRIPTION
  Edit the properties of a music track.

  After editing the music track, the new changes will not automatically be inserted in the ROM hack.
```

## `bazaar-cli project music list`

List all music track added to the project.

```
USAGE
  $ bazaar-cli project music list

DESCRIPTION
  List all music track added to the project.

  Music tracks consist of a ".txt" file containing notes and, optionally, sample
  files.
  Music tracks are inserted into the ROM hack via AddmusicK.
```

## `bazaar-cli project music open`

Open the track (txt) file of the given music track into the code editor.

```
USAGE
  $ bazaar-cli project music open

DESCRIPTION
  Open the track (txt) file of the given music track into the code editor.

  If no code editor is set, this command will fail.
```

## `bazaar-cli project music remove`

Remove a given music track from the current project.

```
USAGE
  $ bazaar-cli project music remove

DESCRIPTION
  Remove a given music track from the current project.

  Removing a music track from a project will not automatically remove it from the ROM hack.
```

## `bazaar-cli project music save-as-template`

Save a given music track as a template.

```
USAGE
  $ bazaar-cli project music save-as-template

DESCRIPTION
  Save a given music track as a template.

  Saving a music track as a template means it can be used later to add the same track to a different project.

  Saving a music track as a template includes its track (txt) file and all samples.
```

## `bazaar-cli project open-code-editor`

Open the project in the code editor

```
USAGE
  $ bazaar-cli project open-code-editor [--log-level debug|info|warn|error] [--verbose] [--path <value>]

FLAGS
  --path=<value>  [default: .] Project directory

GLOBAL FLAGS
  --log-level=(debug|info|warn|error)  [default: info] Specify level for logging
  --verbose                            Produce more logs (info level)

DESCRIPTION
  Open the project in the code editor

  Open the root directory in the code editor.

  If no code editor is set, this command will fail.

  To configure and code-editor, check `bazaar editor code-editor set --help`.

EXAMPLES
  bazaar project open-code-editor

  bazaar project open-code-editor --path=C:\Users\me\Documents\MyProject

FLAG DESCRIPTIONS
  --path=<value>  Project directory

    By default it will be the current working directory.
```

## `bazaar-cli project open-emulator`

Run the ROM hack in the emulator

```
USAGE
  $ bazaar-cli project open-emulator [--log-level debug|info|warn|error] [--verbose] [--path <value>]

FLAGS
  --path=<value>  [default: .] Project directory

GLOBAL FLAGS
  --log-level=(debug|info|warn|error)  [default: info] Specify level for logging
  --verbose                            Produce more logs (info level)

DESCRIPTION
  Run the ROM hack in the emulator

  Run the ROM hack in the configured emulator.

  If no emulator is set, this command will fail.

  To configure and emulator, check `bazaar editor emulator set --help`.

EXAMPLES
  bazaar project open-emulator

  bazaar project open-emulator --path=C:\Users\me\Documents\MyProject

FLAG DESCRIPTIONS
  --path=<value>  Project directory

    By default it will be the current working directory.
```

## `bazaar-cli project open-lunar-magic`

Open the ROM in Lunar Magic.

```
USAGE
  $ bazaar-cli project open-lunar-magic

DESCRIPTION
  Open the ROM in Lunar Magic.

  Open the ROM in Lunar Magic.
  If Lunar Magic is not installed, this command will fail. To install Lunar Magic, run `bazaar tool install
  lunar-magic`.
```

## `bazaar-cli project patch add-from-directory`

Add a patch to the project from an directory.

```
USAGE
  $ bazaar-cli project patch add-from-directory

DESCRIPTION
  Add a patch to the project from an directory.

  Adding a patch to the project will not insert it automatically into the ROM hack.

  This is useful when a patch consists of multiple files. An entry file must be provided as well.
```

## `bazaar-cli project patch add-from-file`

Add a patch to the project from an ASM file.

```
USAGE
  $ bazaar-cli project patch add-from-file

DESCRIPTION
  Add a patch to the project from an ASM file.

  Adding a patch to the project will not insert it automatically into the ROM hack.
```

## `bazaar-cli project patch add-from-template`

Add a patch to the project from an template.

```
USAGE
  $ bazaar-cli project patch add-from-template

DESCRIPTION
  Add a patch to the project from an template.

  Adding a patch to the project will not insert it automatically into the ROM hack.
```

## `bazaar-cli project patch apply`

Apply a given patches to the ROM.

```
USAGE
  $ bazaar-cli project patch apply

DESCRIPTION
  Apply a given patches to the ROM.

  Apply a patch added to the project into the ROM hack via Asar.
```

## `bazaar-cli project patch apply-all`

Apply all patches to the ROM.

```
USAGE
  $ bazaar-cli project patch apply-all

DESCRIPTION
  Apply all patches to the ROM.

  Apply all patches added to the project into the ROM hack via Asar.
```

## `bazaar-cli project patch edit`

Edit the properties of a patch.

```
USAGE
  $ bazaar-cli project patch edit

DESCRIPTION
  Edit the properties of a patch.

  After editing the patch, the new changes will not automatically be inserted in the ROM hack.
```

## `bazaar-cli project patch list`

List all patches added to the project.

```
USAGE
  $ bazaar-cli project patch list

DESCRIPTION
  List all patches added to the project.

  Patches consist of one or more ASM code files.
  Patches are inserted into the ROM hack via Asar.
```

## `bazaar-cli project patch open-directory`

Open the directory of the given patch into the code editor.

```
USAGE
  $ bazaar-cli project patch open-directory

DESCRIPTION
  Open the directory of the given patch into the code editor.

  If no code editor is set, this command will fail.
```

## `bazaar-cli project patch open-entry-file`

Open the main ASM file of the given patch into the code editor.

```
USAGE
  $ bazaar-cli project patch open-entry-file

DESCRIPTION
  Open the main ASM file of the given patch into the code editor.

  If no code editor is set, this command will fail.
```

## `bazaar-cli project patch remove`

Remove a given patch from the current project.

```
USAGE
  $ bazaar-cli project patch remove

DESCRIPTION
  Remove a given patch from the current project.

  Removing a patch from a project will not automatically remove it from the ROM hack.
```

## `bazaar-cli project patch save-as-template`

Save a given patch as a template.

```
USAGE
  $ bazaar-cli project patch save-as-template

DESCRIPTION
  Save a given patch as a template.

  Saving a patch as a template means it can be used later to add the same patch to a different project.

  Saving a patch as a template includes all of its ASM files.
```

## `bazaar-cli project release create`

```
USAGE
  $ bazaar-cli project release create
```

## `bazaar-cli project release list`

```
USAGE
  $ bazaar-cli project release list
```

## `bazaar-cli project release remove`

```
USAGE
  $ bazaar-cli project release remove
```

## `bazaar-cli project save-as-template`

Save the current project as a template.

```
USAGE
  $ bazaar-cli project save-as-template

DESCRIPTION
  Save the current project as a template.

  Saving a project as a template means it can be used later to create new projects with the same structure.

  Saving a project as a template includes: ROM, blocks, music, patches, sprites, and UberASM code.
```

## `bazaar-cli project sprite add-from-file`

Add a sprite to the project from an ASM file.

```
USAGE
  $ bazaar-cli project sprite add-from-file

DESCRIPTION
  Add a sprite to the project from an ASM file.

  Adding a sprite to the project will not insert it automatically into the ROM hack.
```

## `bazaar-cli project sprite add-from-template`

Add a sprite to the project from an template.

```
USAGE
  $ bazaar-cli project sprite add-from-template

DESCRIPTION
  Add a sprite to the project from an template.

  Adding a sprite to the project will not insert it automatically into the ROM hack.
```

## `bazaar-cli project sprite apply-all`

Insert all sprites into the ROM.

```
USAGE
  $ bazaar-cli project sprite apply-all

DESCRIPTION
  Insert all sprites into the ROM.

  Insert all sprites added to the project into the ROM hack via Pixie.
```

## `bazaar-cli project sprite edit`

Edit the properties of a sprite.

```
USAGE
  $ bazaar-cli project sprite edit

DESCRIPTION
  Edit the properties of a sprite.

  After editing the sprite, the new changes will not automatically be inserted in the ROM hack.
```

## `bazaar-cli project sprite list`

List all sprites added to the project.

```
USAGE
  $ bazaar-cli project sprite list

DESCRIPTION
  List all sprites added to the project.

  Sprites consist of a single ASM code file and TODO.
  Sprites are inserted into the ROM hack via Pixie.
```

## `bazaar-cli project sprite open`

Open the ASM file of the given sprite into the code editor.

```
USAGE
  $ bazaar-cli project sprite open

DESCRIPTION
  Open the ASM file of the given sprite into the code editor.

  If no code editor is set, this command will fail.
```

## `bazaar-cli project sprite remove`

Remove a given sprite from the current project.

```
USAGE
  $ bazaar-cli project sprite remove

DESCRIPTION
  Remove a given sprite from the current project.

  Removing a sprite from a project will not automatically remove it from the ROM hack.
```

## `bazaar-cli project sprite save-as-template`

Save a given sprite as a template.

```
USAGE
  $ bazaar-cli project sprite save-as-template

DESCRIPTION
  Save a given sprite as a template.

  Saving a sprite as a template means it can be used later to add the same sprite to a different project.

  Saving a sprite as a template includes its ASM file, id, and save-as numbers.
```

## `bazaar-cli project uber-asm add-from-directory`

Add UberASM code to the project from an directory.

```
USAGE
  $ bazaar-cli project uber-asm add-from-directory

DESCRIPTION
  Add UberASM code to the project from an directory.

  Adding UberASM code to the project will not insert it automatically into the ROM hack.
```

## `bazaar-cli project uber-asm add-from-template`

Add UberASM code to the project from an template.

```
USAGE
  $ bazaar-cli project uber-asm add-from-template

DESCRIPTION
  Add UberASM code to the project from an template.

  Adding UberASM code to the project will not insert it automatically into the ROM hack.
```

## `bazaar-cli project uber-asm apply`

```
USAGE
  $ bazaar-cli project uber-asm apply
```

## `bazaar-cli project uber-asm apply-all`

Apply all UberASM code to the ROM.

```
USAGE
  $ bazaar-cli project uber-asm apply-all

DESCRIPTION
  Apply all UberASM code to the ROM.

  Apply all UberASM code added to the project into the ROM hack via UberASM.
```

## `bazaar-cli project uber-asm edit`

Edit the properties of UberASM code.

```
USAGE
  $ bazaar-cli project uber-asm edit

DESCRIPTION
  Edit the properties of UberASM code.

  After editing the UberASM code, the new changes will not automatically be inserted in the ROM hack.
```

## `bazaar-cli project uber-asm list`

List all UberASM code added to the project.

```
USAGE
  $ bazaar-cli project uber-asm list

DESCRIPTION
  List all UberASM code added to the project.

  UberASM code consist of TODO.
  UberASM code is inserted into the ROM hack via UberASM.
```

## `bazaar-cli project uber-asm open`

Open the directory of the given UberASM code into the code editor.

```
USAGE
  $ bazaar-cli project uber-asm open

DESCRIPTION
  Open the directory of the given UberASM code into the code editor.

  If no code editor is set, this command will fail.
```

## `bazaar-cli project uber-asm remove`

Remove given UberASM code from the current project.

```
USAGE
  $ bazaar-cli project uber-asm remove

DESCRIPTION
  Remove given UberASM code from the current project.

  Removing UberASM code from a project will not automatically remove it from the ROM hack.
```

## `bazaar-cli project uber-asm save-as-template`

Save given UberASM code as a template.

```
USAGE
  $ bazaar-cli project uber-asm save-as-template

DESCRIPTION
  Save given UberASM code as a template.

  Saving a UberASM code as a template means it can be used later to add the same UberASM code to a different project.

  Saving a UberASM code as a template includes all of its ASM files.
```

## `bazaar-cli template block add`

Add a new block as a template.

```
USAGE
  $ bazaar-cli template block add

DESCRIPTION
  Add a new block as a template.

  Block templates can be saved for later use in different projects.
```

## `bazaar-cli template block edit`

Edit the properties of a block template.

```
USAGE
  $ bazaar-cli template block edit

DESCRIPTION
  Edit the properties of a block template.

  Properties of a block template include its name, authors, version, id, act-as number, and ASM files.

  Editing a template will not alter any project that used the template to add a block.
```

## `bazaar-cli template block remove`

Remove a block from the list of available templates.

```
USAGE
  $ bazaar-cli template block remove

DESCRIPTION
  Remove a block from the list of available templates.

  Removing a block from the list of available templates will not remove it from any project that used it.
```

## `bazaar-cli template music add`

Add a new music as a template.

```
USAGE
  $ bazaar-cli template music add

DESCRIPTION
  Add a new music as a template.

  Music templates can be saved for later use in different projects.
```

## `bazaar-cli template music edit`

Edit the properties of a music track template.

```
USAGE
  $ bazaar-cli template music edit

DESCRIPTION
  Edit the properties of a music track template.

  Properties of a music track template include its name, authors, version, track file, and sample files.

  Editing a template will not alter any project that used the template to add amusic track.
```

## `bazaar-cli template music remove`

Remove a music track from the list of available templates.

```
USAGE
  $ bazaar-cli template music remove

DESCRIPTION
  Remove a music track from the list of available templates.

  Removing a music track from the list of available templates will not remove it from any project that used it.
```

## `bazaar-cli template patch add`

Add a new patch as a template.

```
USAGE
  $ bazaar-cli template patch add

DESCRIPTION
  Add a new patch as a template.

  Patch templates can be saved for later use in different projects.
```

## `bazaar-cli template patch edit`

Edit the properties of a patch template.

```
USAGE
  $ bazaar-cli template patch edit

DESCRIPTION
  Edit the properties of a patch template.

  Properties of a patch template include its name, authors, version, ASM files,
  and the entry file name.

  Editing a template will not alter any project that used the template to add a patch.
```

## `bazaar-cli template patch remove`

Remove a patch from the list of available templates.

```
USAGE
  $ bazaar-cli template patch remove

DESCRIPTION
  Remove a patch from the list of available templates.

  Removing a patch from the list of available templates will not remove it from any project that used it.
```

## `bazaar-cli template project add`

Add a new project as a template starting from a baserom.

```
USAGE
  $ bazaar-cli template project add

DESCRIPTION
  Add a new project as a template starting from a baserom.

  Project templates can be saved to create new projects.
```

## `bazaar-cli template project edit`

Edit the properties of a project template.

```
USAGE
  $ bazaar-cli template project edit

DESCRIPTION
  Edit the properties of a project template.

  Editable properties of a project template include only its name.

  Editing a template will not alter any project that was created using it as a starting point.
```

## `bazaar-cli template project remove`

Remove a project from the list of available templates.

```
USAGE
  $ bazaar-cli template project remove

DESCRIPTION
  Remove a project from the list of available templates.

  Removing a project from the list of available templates will not impact any project that used it as a starting point.
```

## `bazaar-cli template sprite add`

Add a new sprite as a template.

```
USAGE
  $ bazaar-cli template sprite add

DESCRIPTION
  Add a new sprite as a template.

  Sprite templates can be saved for later use in different projects.
```

## `bazaar-cli template sprite edit`

Edit the properties of a sprite template.

```
USAGE
  $ bazaar-cli template sprite edit

DESCRIPTION
  Edit the properties of a sprite template.

  Properties of a sprite template include its name, authors, version, id, and ASM file.

  Editing a template will not alter any project that used the template to add a sprite.
```

## `bazaar-cli template sprite remove`

Remove a sprite from the list of available templates.

```
USAGE
  $ bazaar-cli template sprite remove

DESCRIPTION
  Remove a sprite from the list of available templates.

  Removing a sprite from the list of available templates will not remove it from any project that used it.
```

## `bazaar-cli template uber-asm add`

Add new UberASM code as a template.

```
USAGE
  $ bazaar-cli template uber-asm add

DESCRIPTION
  Add new UberASM code as a template.

  UberASM code templates can be saved for later use in different projects.
```

## `bazaar-cli template uber-asm edit`

Edit the properties of UberASM code template.

```
USAGE
  $ bazaar-cli template uber-asm edit

DESCRIPTION
  Edit the properties of UberASM code template.

  Properties of UberASM code template include its name, authors, version, and ASM
  files.
  Editing a template will not alter any project that used the template to add UberASM code.
```

## `bazaar-cli template uber-asm remove`

Remove UberASM code from the list of available templates.

```
USAGE
  $ bazaar-cli template uber-asm remove

DESCRIPTION
  Remove UberASM code from the list of available templates.

  Removing UberASM code from the list of available templates will not remove it from any project that used it.
```

## `bazaar-cli tool install TOOL-NAME`

Install a given tool

```
USAGE
  $ bazaar-cli tool install [TOOL-NAME] [--log-level debug|info|warn|error] [--verbose] [-f]

ARGUMENTS
  TOOL-NAME  (addmusick|asar|flips|gps|lunarmagic|pixi|uberasmtool) Name of the tool

FLAGS
  -f, --force  Install the tool even if another version is already installed

GLOBAL FLAGS
  --log-level=(debug|info|warn|error)  [default: info] Specify level for logging
  --verbose                            Produce more logs (info level)

DESCRIPTION
  Install a given tool

  The tool will be downloaded by SMWCentral.

  By default, only a tool that is not installed can be installed. If the `--force` flag is given, the newest supported
  version of the tool will be installed regardless of its current installation status.

  The command will fail if trying to install an already installed tool without the `--force` flag.

  Installing a tool will not interfere with any other manual installation of the tool made by the user on the same
  machine.

EXAMPLES
  bazaar tool install asar

  bazaar tool install lunar-magic --force

FLAG DESCRIPTIONS
  -f, --force  Install the tool even if another version is already installed

    Force-installing a tool will remove other versions of the tool previously installed.
```

## `bazaar-cli tool install-all`

Install all tools required by Bazaar

```
USAGE
  $ bazaar-cli tool install-all [--log-level debug|info|warn|error] [--verbose] [-f]

FLAGS
  -f, --force  Install all tools even if other versions are already installed

GLOBAL FLAGS
  --log-level=(debug|info|warn|error)  [default: info] Specify level for logging
  --verbose                            Produce more logs (info level)

DESCRIPTION
  Install all tools required by Bazaar

  The tools will be downloaded by SMWCentral.

  By default, only a tool that is not installed can be installed. If the `--force` flag is given, the newest supported
  version of the tool will be installed regardless of its current installation status.

  The command will ignore already installed tools without if executed without the `--force` flag.

  Installing a tool will not interfere with any other manual installation of the tool made by the user on the same
  machine.

EXAMPLES
  bazaar tool install-all

  bazaar tool install-all --force

FLAG DESCRIPTIONS
  -f, --force  Install all tools even if other versions are already installed

    Force-installing a tool will remove other versions of the tool previously installed.
```

## `bazaar-cli tool list [TOOL-NAME]`

List tools and their installation status

```
USAGE
  $ bazaar-cli tool list [TOOL-NAME] [--log-level debug|info|warn|error] [--verbose] [--columns <value> | -x]
    [--sort <value>] [--filter <value>] [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

ARGUMENTS
  TOOL-NAME  (addmusick|asar|flips|gps|lunarmagic|pixi|uberasmtool) Name of the tool

FLAGS
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

GLOBAL FLAGS
  --log-level=(debug|info|warn|error)  [default: info] Specify level for logging
  --verbose                            Produce more logs (info level)

DESCRIPTION
  List tools and their installation status

  List tools and their installation status. Tools are programs required by Bazaar to perform specific tasks, and need to
  be of a precise version to ensure everything works correctly. For this reason, the user cannot choose to use a custom
  version.

  The installation of tools is completely handled by Bazaar. Installing and uninstalling a tool with Bazaar will not
  impact any other installation of the same tool done by the user on the same machine. This means that the user can
  still use their preferred tools for hacking SMW without Bazaar.

  A tool can be either not installed, installed, or deprecated:
  - not-installed: The tool is not installed in Bazaar, tasks that require the tool cannot be performed.
  - installed: The correct version of the tool has been installed in Bazaar. If the version appears to be broken
  (doesn't work correctly), you can uninstall it and install it again (or force install it). For more, check `bazaar
  tool install --help` and `bazaar tool uninstall --help`.
  - deprecated: The wrong version of the tool has been installed in Bazaar. This can happen if the user upgraded Bazaar,
  and the new version requires a different version of a tool previously installed. To upgrade a tool, check `bazaar tool
  update --help`.

  Tools used by Bazaar:
  - AddmusicK: Used to insert music.
  - Asar: Used to apply patches.
  - Flips: Used to produce releases (BPS files).
  - GPS: Used to insert blocks.
  - Lunar Magic: Used to open the ROM hack, and extract graphics and levels.
  - PIXI: Used to insert sprites.
  - UberASM: Used to apply UberASM code.

  The difference between tools and editors: tools need to be of specific versions to ensure that they work correctly,
  while editors are user-chosen programs. If you want to install tools instead, check out `bazaar editor --help`.

EXAMPLES
  bazaar tool list

  bazaar tool list uber-asm
```

## `bazaar-cli tool uninstall TOOL-NAME`

Uninstall a given tool

```
USAGE
  $ bazaar-cli tool uninstall [TOOL-NAME] [--log-level debug|info|warn|error] [--verbose]

ARGUMENTS
  TOOL-NAME  (addmusick|asar|flips|gps|lunarmagic|pixi|uberasmtool) Name of the tool

GLOBAL FLAGS
  --log-level=(debug|info|warn|error)  [default: info] Specify level for logging
  --verbose                            Produce more logs (info level)

DESCRIPTION
  Uninstall a given tool

  Only tools that are already installed can be uninstalled. Trying to uninstall a
  non-installed tool will cause an error.

  Uninstalling a tool with Bazaar will not cause any other installation made bythe user on the machine to be
  uninstalled.

EXAMPLES
  bazaar tool uninstall gps
```

## `bazaar-cli tool uninstall-all`

Uninstall all tools

```
USAGE
  $ bazaar-cli tool uninstall-all [--log-level debug|info|warn|error] [--verbose]

GLOBAL FLAGS
  --log-level=(debug|info|warn|error)  [default: info] Specify level for logging
  --verbose                            Produce more logs (info level)

DESCRIPTION
  Uninstall all tools

  Only tools that are already installed can be uninstalled. Tools that are not installed will be ignored.

  Uninstalling tools with Bazaar will not cause any other installation made by the user on the machine to be
  uninstalled.

EXAMPLES
  bazaar tool uninstall-all
```

## `bazaar-cli tool update TOOL-NAME`

Update a given tool to the version supported by Bazaar

```
USAGE
  $ bazaar-cli tool update [TOOL-NAME] [--log-level debug|info|warn|error] [--verbose]

ARGUMENTS
  TOOL-NAME  (addmusick|asar|flips|gps|lunarmagic|pixi|uberasmtool) Name of the tool

GLOBAL FLAGS
  --log-level=(debug|info|warn|error)  [default: info] Specify level for logging
  --verbose                            Produce more logs (info level)

DESCRIPTION
  Update a given tool to the version supported by Bazaar

  The new version of the tool will be downloaded by SMWCentral.

  Only a tool with status deprecated can be updated. If a tool is not deprecated, the command will fail.

  Updating a tool will not cause any other version of the tool installed manually by the user on the same machine to be
  updated.

EXAMPLES
  bazaar tool update addmusick
```

## `bazaar-cli tool update-all`

Update all tools to their last version supported by Bazaar

```
USAGE
  $ bazaar-cli tool update-all [--log-level debug|info|warn|error] [--verbose]

GLOBAL FLAGS
  --log-level=(debug|info|warn|error)  [default: info] Specify level for logging
  --verbose                            Produce more logs (info level)

DESCRIPTION
  Update all tools to their last version supported by Bazaar

  The new versions of the tools will be downloaded by SMWCentral.

  Only a tool with status deprecated can be updated. If a tool is not deprecated, it will be ignored.

  Updating a tool will not cause any other version of the tool installed manually by the user on the same machine to be
  updated.

EXAMPLES
  bazaar tool update-all
```
<!-- commandsstop -->
