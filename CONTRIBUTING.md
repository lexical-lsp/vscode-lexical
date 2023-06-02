# Contributing

## Setting up your environment

1. Install [yarn](https://yarnpkg.com/)

   Yarn is available for installation through asdf:

   ```sh
   asdf plugin add yarn
   asdf install
   ```

2. Install dependencies: `yarn install`

## Starting the extension

Press F5. VSCode should build and start the extension.

## Installing the extension globally

```sh
yarn package
code --install-extension *.vsix
```

## Publishing the extension

1. Make sure the version number has been updated in [`package.json`](./package.json)
1. Log in to your Azure DevOps account
   1. [Create an Azure DevOps organization](https://learn.microsoft.com/en-ca/azure/devops/organizations/accounts/create-organization?view=azure-devops#create-an-organization) if you don't already have one. The organization name doesn't matter, you simply need one to access Azure DevOps and create a Personal Access Token.
   1. [Create a Personal Access Token](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#get-a-personal-access-token) with the "Manage Marketplace" scope if you don't already have one.
   1. Login in to vsce: `yarn vsce:login` with your Personal Access Token
1. Publish the extension: `yarn vsce:publish`
