# oclif-hello-world

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->

- [Usage](#usage)
- [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g bazaar-cli
$ bazaar-cli COMMAND
running command...
$ bazaar-cli (--version)
bazaar-cli/0.0.0 darwin-arm64 node-v18.0.0
$ bazaar-cli --help [COMMAND]
USAGE
  $ bazaar-cli COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`bazaar-cli hello PERSON`](#bazaar-cli-hello-person)
- [`bazaar-cli hello world`](#bazaar-cli-hello-world)
- [`bazaar-cli help [COMMAND]`](#bazaar-cli-help-command)
- [`bazaar-cli plugins`](#bazaar-cli-plugins)
- [`bazaar-cli plugins:install PLUGIN...`](#bazaar-cli-pluginsinstall-plugin)
- [`bazaar-cli plugins:inspect PLUGIN...`](#bazaar-cli-pluginsinspect-plugin)
- [`bazaar-cli plugins:install PLUGIN...`](#bazaar-cli-pluginsinstall-plugin-1)
- [`bazaar-cli plugins:link PLUGIN`](#bazaar-cli-pluginslink-plugin)
- [`bazaar-cli plugins:uninstall PLUGIN...`](#bazaar-cli-pluginsuninstall-plugin)
- [`bazaar-cli plugins:uninstall PLUGIN...`](#bazaar-cli-pluginsuninstall-plugin-1)
- [`bazaar-cli plugins:uninstall PLUGIN...`](#bazaar-cli-pluginsuninstall-plugin-2)
- [`bazaar-cli plugins update`](#bazaar-cli-plugins-update)

## `bazaar-cli hello PERSON`

Say hello

```
USAGE
  $ bazaar-cli hello [PERSON] -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/zuccha/bazaar-cli/blob/v0.0.0/dist/commands/hello/index.ts)_

## `bazaar-cli hello world`

Say hello world

```
USAGE
  $ bazaar-cli hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ bazaar-cli hello world
  hello world! (./src/commands/hello/world.ts)
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

<!-- commandsstop -->
