# Lexical

Lexical is a next-generation language server for the Elixir programming language.

## Features

- Context aware code completion
- As-you-type compilation
- Advanced error highlighting
- Code actions
- Code Formatting
- Completely isolated build environment

For all the details on what makes Lexical stand out from other Elixir language servers, see the [language server repository](https://github.com/lexical-lsp/lexical).

## Using the extension

This extension will automatically download and install the [latest Lexical release](https://github.com/lexical-lsp/lexical/releases) from Github when starting up. You can disable this behaviour and point the extension to your own build with the [`lexical.server.releasePathOverride` configuration option](#lexicalserverreleasepathoverride).

## Configuration

### lexical.server.releasePathOverride

Tells the extension to use a local release of the Lexical language server instead of the automatically installed one. Useful to work on Lexical, or use an older version.

The path should look something like `/home/username/Projects/lexical/_build/dev/rel/lexical`.

## Troubleshooting

Lexical outputs logs to two different files:

- `lexical.log`: Contains logs for the language server node, which handles all the LSP communication, code intelligence, etc.
- `project.log`: Contains logs for the project node, which handles loading and compiling your project.

### Known issues


Lexical supports the following versions of Elixir and Erlang:

| Erlang      | Version range    | Notes  |
| ----------- |----------------- | ------ |
|  24         | `>= 24.3.4.12`   | Might run on older versions; this was the lowest that would compile on arm |
|  25         | `>= 25.0`        |        |
|  26         | In progress      |        |

| Elixir   | Version Range  | Notes    |
| -------- | -------------- | -------- |
| 1.13     |    `>= 1.13.4` |          |
| 1.14     |    `all`       |          |
| 1.15     | `>= 1.15.3`    | `1.15.0` - `1.15.2` had compiler bugs that prevented lexical from working |

If you cannot use one of the above versions of Erlang, a workaround is to clone the [Lexical language server repo](https://github.com/lexical-lsp/lexical), change `include_erts` to `true` in `mix.exs`, build a release following the instructions in the README and [configure the extension to use that local release](#lexicalserverreleasepathoverride)

### Getting help

If you have questions or need help, please refer to one of the following channels:

- The [issues on the vscode-lexical project](https://github.com/lexical-lsp/vscode-lexical/issues)
- The [issues on the lexical project](https://github.com/lexical-lsp/lexical/issues)
- The `#editor-tooling` channel in the [Elixir Discord server](https://discord.gg/elixir)
