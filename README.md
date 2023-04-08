# lexical README

## Using the extension

The extension is not yet published to the Visual Studio Marketplace. The extension must be built and installed manually.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for instructions on setting up dependencies.

### Starting the extension for development

Press F5. VSCode should build and start the extension.

### Installing the extension globally

```sh
npx vsce package --yarn
code --install-extension *.vsix
```

### Using a version of Lexical other than the latest release

The extension automatically downloads and installs the latest release of Lexical.

If you wish to use any other version, such as an older or development version, you must download or build the corresponding release. You must then set the `lexical.server.releasePathOverride` setting to the folder containing the release you want to use.

The path should look something like `/home/username/Projects/lexical/_build/dev/rel/lexical`.

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
