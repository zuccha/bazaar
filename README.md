oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g bazar-cli
$ bazar-cli COMMAND
running command...
$ bazar-cli (--version)
bazar-cli/0.0.0 darwin-arm64 node-v18.0.0
$ bazar-cli --help [COMMAND]
USAGE
  $ bazar-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`bazar-cli hello PERSON`](#bazar-cli-hello-person)
* [`bazar-cli hello world`](#bazar-cli-hello-world)
* [`bazar-cli help [COMMAND]`](#bazar-cli-help-command)
* [`bazar-cli plugins`](#bazar-cli-plugins)
* [`bazar-cli plugins:install PLUGIN...`](#bazar-cli-pluginsinstall-plugin)
* [`bazar-cli plugins:inspect PLUGIN...`](#bazar-cli-pluginsinspect-plugin)
* [`bazar-cli plugins:install PLUGIN...`](#bazar-cli-pluginsinstall-plugin-1)
* [`bazar-cli plugins:link PLUGIN`](#bazar-cli-pluginslink-plugin)
* [`bazar-cli plugins:uninstall PLUGIN...`](#bazar-cli-pluginsuninstall-plugin)
* [`bazar-cli plugins:uninstall PLUGIN...`](#bazar-cli-pluginsuninstall-plugin-1)
* [`bazar-cli plugins:uninstall PLUGIN...`](#bazar-cli-pluginsuninstall-plugin-2)
* [`bazar-cli plugins update`](#bazar-cli-plugins-update)

## `bazar-cli hello PERSON`

Say hello

```
USAGE
  $ bazar-cli hello [PERSON] -f <value>

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

_See code: [dist/commands/hello/index.ts](https://github.com/zuccha/bazar-cli/blob/v0.0.0/dist/commands/hello/index.ts)_

## `bazar-cli hello world`

Say hello world

```
USAGE
  $ bazar-cli hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ bazar-cli hello world
  hello world! (./src/commands/hello/world.ts)
```

## `bazar-cli help [COMMAND]`

Display help for bazar-cli.

```
USAGE
  $ bazar-cli help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for bazar-cli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.15/src/commands/help.ts)_

## `bazar-cli plugins`

List installed plugins.

```
USAGE
  $ bazar-cli plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ bazar-cli plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.1.2/src/commands/plugins/index.ts)_

## `bazar-cli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ bazar-cli plugins:install PLUGIN...

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
  $ bazar-cli plugins add

EXAMPLES
  $ bazar-cli plugins:install myplugin 

  $ bazar-cli plugins:install https://github.com/someuser/someplugin

  $ bazar-cli plugins:install someuser/someplugin
```

## `bazar-cli plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ bazar-cli plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ bazar-cli plugins:inspect myplugin
```

## `bazar-cli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ bazar-cli plugins:install PLUGIN...

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
  $ bazar-cli plugins add

EXAMPLES
  $ bazar-cli plugins:install myplugin 

  $ bazar-cli plugins:install https://github.com/someuser/someplugin

  $ bazar-cli plugins:install someuser/someplugin
```

## `bazar-cli plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ bazar-cli plugins:link PLUGIN

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
  $ bazar-cli plugins:link myplugin
```

## `bazar-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ bazar-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ bazar-cli plugins unlink
  $ bazar-cli plugins remove
```

## `bazar-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ bazar-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ bazar-cli plugins unlink
  $ bazar-cli plugins remove
```

## `bazar-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ bazar-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ bazar-cli plugins unlink
  $ bazar-cli plugins remove
```

## `bazar-cli plugins update`

Update installed plugins.

```
USAGE
  $ bazar-cli plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
