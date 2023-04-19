# lexical README

## Using the extension

The extension is not yet published to the Visual Studio Marketplace. The extension must be built and installed manually.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for instructions on setting up dependencies.

The extension automatically downloads and installs a predefined build of Lexical from a private S3 repository. Follow [the instructions below](#using-a-version-of-lexical-other-than-the-predefined-one) if you want to make sure you're using the latest version. Support for automatic download of the latest release will be coming soon. 

### Starting the extension for development

Press F5. VSCode should build and start the extension.

### Installing the extension globally

```sh
npx vsce package --yarn
code --install-extension *.vsix
```

### Using a version of Lexical other than the predefined one

If you wish to use any version of Lexical other than the one currently provided, such as an older or development version, you must download or build the corresponding release. You must then set the `lexical.server.releasePathOverride` setting to the folder containing the release you want to use.

The path should look something like `/home/username/Projects/lexical/_build/dev/rel/lexical`.

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
