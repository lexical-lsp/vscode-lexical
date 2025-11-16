[![Discord](https://img.shields.io/badge/Discord-5865F3?style=flat&logo=discord&logoColor=white&link=https://discord.gg/FvdkuVyted)](https://discord.gg/FvdkuVyted)
![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/lexical-lsp/vscode-lexical/workflow.yml)
[![Number of installs](https://img.shields.io/visual-studio-marketplace/i/lexical-lsp.lexical)](https://marketplace.visualstudio.com/items?itemName=lexical-lsp.lexical)

<img alt="Lexical logo: Lexi the lynx" src="https://raw.githubusercontent.com/lexical-lsp/lexical/main/assets/lexi-logo.png" width="150" height="200" align="right"/>

# Lexical

Lexical is a next-generation language server for the Elixir programming
language.

## Features

- Context aware code completion
- As-you-type compilation
- Advanced error highlighting
- Code actions
- Code formatting
- Completely isolated build environment
- Syntax highlighting

For all the details on what makes Lexical stand out from other Elixir language
servers, see the
[language server repository](https://github.com/lexical-lsp/lexical).

## Using the extension

This extension will automatically download and install the
[latest Lexical release](https://github.com/lexical-lsp/lexical/releases) from
Github when starting up. You can disable this behaviour and point the extension
to your own build with the
[`lexical.server.releasePathOverride` configuration option](#lexicalserverreleasepathoverride).

### Using with Expert

While this extension was originally built for the Lexical language server,
it does not actually have any functionality specific to it outside of automatic
server installation.

This means it can also be used with other language servers, such as [Expert](https://github.com/elixir-lang/expert).

Because vscode-lexical does not yet [support passing arguments to the server](https://github.com/lexical-lsp/vscode-lexical/issues/98),
a little more work is required to use this extension with Expert. Here is an
example configuration:

1. Create a script within your project that starts Expert at the correct
location with the `--stdio` flag. Under your workspace, create the script
`scripts/start_expert.sh`:
    ```sh
    #!/bin/sh

    /path/to/my/expert/build --stdio
    ```
1. Make the script executable: `chmod +x scripts/start_expert.sh`
1. Configure vscode-lexical to start the server using this script. In your `settings.json`:
    ```json
    {
      "lexical.server.releasePathOverride": "./scripts/start_expert.sh"
    }
    ```

Expert should now start instead of Lexical when loading VS Code in your workspace.

## Configuration

### lexical.server.releasePathOverride

Tells the extension to use a local release of the Lexical language server
instead of the automatically installed one. Useful to work on Lexical, or use an
older version. This path can point to a directory that holds the lexical start
script (assumed to be `start_lexical.sh`) or any executable launcher script.
Relative paths will be interpreted to be relative to the current VS Code workspace.

The path should look something like
`/home/username/Projects/lexical/_build/dev/package/lexical/bin/start_lexical.sh`.

### lexical.notifyOnServerAutoUpdate

Controls whether notifications are shown after automatic installs of new Lexcial
versions. Defaults to `true`.

### Editor Configuration

The extension provides a language configuration for Elixir which marks
`do`/`end` and `fn`/`end` as brackets. Among other things, this enables
colorization of `do`/`end` and `fn`/`end` with VSCode's
`editor.bracketPairColorization.enabled` setting. While this can be helpful when
searching for a `do`'s corresponding `end`, some users may prefer to use the
standard keyword coloring, while still highlighting parenthesis and other
brackets. This can be achieved by adding the following to your VSCode
configuration.

```jsonc
"editor.bracketPairColorization.enabled": true,
"[elixir]": {
  "editor.language.colorizedBracketPairs": [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"]
  ]
}
```

### Erlang and Elixir version compatibility

#### Erlang

Auto-installed builds of Lexical are compatible with Elixir and Erlang versions
that are newer than the version the build was built with.

Refer to the following table to know which version that is:

| Lexical  | Erlang    |
| -------- | --------- |
| 0.2.2    | 24.3.4.13 |
| >= 0.2.3 | 24.3.4.12 |

Refer to the
[Releases page of Lexical](https://github.com/lexical-lsp/lexical/releases) to
find out what the latest version is.

These versions are a couple years old, and if you are using newer versions of
Elixir and Erlang and Elixir in your projects, perfomrance will likely be better
if you built Lexical yourself with a newer version of Elixir and Erlang.

This isn't hard to do: clone the
[Lexical language server repo](https://github.com/lexical-lsp/lexical), build a
release following the instructions in the README and
[configure the extension to use that local release](#lexicalserverreleasepathoverride).

The following table illustrates which versions of Erlang Lexical is compatible
with when building yourself.

| Erlang | Version range  | Notes                                                                      |
| ------ | -------------- | -------------------------------------------------------------------------- |
| 24     | `>= 24.3.4.12` | Might run on older versions; this was the lowest that would compile on arm |
| 25     | `>= 25.0`      |                                                                            |
| 26     | In progress    |                                                                            |

#### Elixir

Lexical has much less strict requirements on the version of Elixir. Any
supported version of Elixir should work with any build of Lexical,
auto-installed or not. The supported versions of Elixir are as follows:

| Elixir | Version Range | Notes                                                                     |
| ------ | ------------- | ------------------------------------------------------------------------- |
| 1.13   | `>= 1.13.4`   |                                                                           |
| 1.14   | `all`         |                                                                           |
| 1.15   | `>= 1.15.3`   | `1.15.0` - `1.15.2` had compiler bugs that prevented lexical from working |

## Troubleshooting

Lexical outputs logs to two different files:

- `lexical.log`: Contains logs for the language server node, which handles all
  the LSP communication, code intelligence, etc.
- `project.log`: Contains logs for the project node, which handles loading and
  compiling your project.

Additionally, the Lexical channel in VSCode's Output tab may contain some
pertinent information, notably when Lexical fails to start whatsoever (no log
files are created).

### Frequent issues and questions

#### Error in output tab: `init terminating in do_boot ({load_failed,[logger_simple_h,gen,logger_server,...`

This error usually means your version of Erlang is incompatible with your build
of Lexical. Please refer to the [Erlang compatibility section](#erlang) for more
details.

#### I'm not getting syntax highlighting for HEEx

This extension does not support syntax highlighting for HEEx, either in `.heex`
files or in `~H` sigils. HEEx syntax highlighting is provided by the
[Phoenix Framework extension](https://marketplace.visualstudio.com/items?itemName=phoenixframework.phoenix).

### Getting help

If you have questions or need help, please refer to one of the following
channels:

- The
  [issues on the vscode-lexical project](https://github.com/lexical-lsp/vscode-lexical/issues)
- The
  [issues on the lexical project](https://github.com/lexical-lsp/lexical/issues)
- The `#editor-tooling` channel in the
  [Elixir Discord server](https://discord.gg/elixir)
