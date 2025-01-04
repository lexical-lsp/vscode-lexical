# Contributing

## Setting up your environment

1. Install [NodeJS](https://nodejs.org), [Elixir](https://elixir-lang.org/) and
   [Erlang](https://www.erlang.org/)

   The recommended installation method is through [asdf](https://asdf-vm.com/)
   or [mise](https://mise.jdx.dev/):

   <details>
   <summary>asdf</summary>
    
   ```sh
   asdf plugin add nodejs
   # Make sure you have the required dependencies https://github.com/asdf-vm/asdf-elixir?tab=readme-ov-file#install
   asdf plugin add elixir
   # Make sure you have the required dependencies https://github.com/asdf-vm/asdf-erlang?tab=readme-ov-file#before-asdf-install
   asdf plugin add erlang
   asdf install
   ```
   </details>

   <details>
   <summary>mise</summary>

   ```sh
   # Make sure you have the required dependencies
   # https://github.com/asdf-vm/asdf-elixir?tab=readme-ov-file#install
   # https://github.com/asdf-vm/asdf-erlang?tab=readme-ov-file#before-asdf-install
   mise plugin install --all -y
   mise install
   ```

    </details>

2. Install dependencies: `npm install`

## Starting the extension

Press F5. VSCode should build and start the extension.

## Installing the extension globally

```sh
npm run vsce:package
code --install-extension *.vsix
```

## Publishing the extension

1. Make sure the version number has been updated in
	 [`package.json`](./package.json) and in [CHANGELOG.md](./CHANGELOG.md) if
	 there are any unreleased documented changes
1. Log in to your Azure DevOps account
   1. [Create an Azure DevOps organization](https://learn.microsoft.com/en-ca/azure/devops/organizations/accounts/create-organization?view=azure-devops#create-an-organization)
      if you don't already have one. The organization name doesn't matter, you
      simply need one to access Azure DevOps and create a Personal Access Token.
   1. [Create a Personal Access Token](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#get-a-personal-access-token)
      with the "Manage Marketplace" scope if you don't already have one.
   1. Login in to vsce: `npm run vsce:login` with your Personal Access Token
1. Publish the extension to the VSCode marketplace: `npm run vsce:publish`
1. Follow steps 1 through 3 on
   [this page](https://github.com/eclipse/openvsx/wiki/Publishing-Extensions#how-to-publish-an-extension)
   to setup you Open VSX account and create an access token
1. Publish the extension to Open VSX:
   `npm run ovsx:publish -- <your access token>`
