# lexical README

## Using the extension

The extension is not yet published to the Visual Studio Marketplace. The extension must be built and installed manually.

### Configuring vscode-lexical

vscode-lexical currently does not package lexical itself.

First, clone the lexical repo and follow the instructions in the README to build a release.

Once that's done, create a file called `lexical_release_path.txt` at the root of the project and write to it the absolute path to your lexical release.

It should look something like `/home/username/Projects/lexical/_build/dev/rel`.

### Starting the extension for development

Press F5. VSCode should build and start the extension.

### Installing the extension globally

```sh
npx vsce package --yarn
code --install-extension *.vsix
```

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
