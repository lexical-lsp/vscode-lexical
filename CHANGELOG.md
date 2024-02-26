# Change Log

## [0.0.14]

### Added

- Added the changelog to the extension bundle so it's readable directly from
  VsCode

## [0.0.13]

### Added

- Added more logging to better expose the extension's startup process

### Maintenance

- Updated all of the extension's dependencies. This should have no impact on
  users apart from a slightly smaller package.

## [0.0.12]

### Added

- The `Restart Lexical's language server` command now starts the language server
  if it isn't already running. Useful to quickly restart Lexical if initial
  start failed due to environment reasons, like an incompatible version of
  Erlang or Elixir.
- Added the `projectDir` configuration option which lets users specify a
  subdirectory in which Lexical should be started instead of the workspace root.

### Documentation

- Adds a note in the readme about lack of support for HEEx syntax highlighting
  and directs users to the Phoenix Framework extension instead.

## [0.0.11]

### Added

- Lexical is now published to the Open VSX marketplace.
- New command `Restart Lexical's language server`. Restarts the language server
  without having to reload VSCode entierely.
- Updated the extension to be more descriptive. This should help Lexical come up
  higher in marketplace search results.
- When auto-installing a new release fails during certain key operations,
  Lexical can now fallback to an already installed version rather than failing
  outright and not starting.

## [0.0.10]

### Fixed

- Fixed bad link to Lexical logo in README.

## [0.0.9]

### Added

- Add a description to the extension's manifest.
- Lexical now has a logo!
- Added a few badges to the README for important links and project status.

## [0.0.8]

### Added

- Updates the `lexical.server.releasePathOverride` configuration option to
  support specifying a path to the start script rather than a folder containing
  a Lexical release.
- Grammar improvements that exclude brackets from being matched together when
  part of string or other similar non-structural context.
- Support installing and starting Lexical versions that use the new packaging
  structure. This change should be transparent for users but ensures
  compatibility with future releases of Lexical.

### Fixed

- Improve documentation on which versions of Elixir and Erlang are supported by
  Lexical.

## [0.0.7]

### Added

- Send EEx and HEEx documents to Lexical as those are now supported.

## [0.0.6]

### Fixed

- Fix incorrect command to publish extension in README.
- Improve documentation on which versions of Elixir and Erlang are supported by
  Lexical.

## [0.0.5]

### Fixed

- Register Lexical for HEEx and Surface files as those are not supported.

## [0.0.4]

### Fixed

- Use installed release version to add execute permission to launch scripts,
  fixing an issue where only Lexical version 0.0.1 would be able to start.

## [0.0.3]

### Added

- Support for installating releases with semantic versions, rather than the
  older style of commit releases.
- Bundle extension with [esbuild](https://esbuild.github.io/), making downloaded
  bundle much smaller.

## [0.0.2]

### Added

- Documentation in README to explain features, installation, configuration,
  troubleshooting, etc.
- Ability to automatically download and install the latest release of Lexical on
  extension start.
- Configuration options:
  - `lexical.server.releasePathOverride`: Disables auto-install and manually
    provide a path to a build of Lexical.
  - `lexical.trace.server`: Traces all LSP messages between VSCode and Lexical.
- Elixir grammar to provide syntax highlihting and other basic functionality.
