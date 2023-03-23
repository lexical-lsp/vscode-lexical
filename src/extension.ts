// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { readFile, readFileSync } from "fs";
import { join } from "path";
import { ExtensionContext, window } from "vscode";
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
} from "vscode-languageclient/node";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  startLexical(context);
}

// This method is called when your extension is deactivated
export function deactivate() {}

async function startLexical(context: ExtensionContext) {
  const outputChannel = window.createOutputChannel("Lexical");

  const releaseDirectory = readFileSync(
    context.asAbsolutePath("./lexical_release_path.txt")
  )
    .toString()
    .trim();

  const serverOptions: ServerOptions = {
    command: join(releaseDirectory, "lexical/start_lexical.sh"),
  };

  const clientOptions: LanguageClientOptions = {
    outputChannel,
    // Register the server for Elixir documents
    // the client will iterate through this list and chose the first matching element
    documentSelector: [
      { language: "elixir", scheme: "file" },
      { language: "elixir", scheme: "untitled" },
      { language: "eex", scheme: "file" },
      { language: "eex", scheme: "untitled" },
      { language: "html-eex", scheme: "file" },
      { language: "html-eex", scheme: "untitled" },
      { language: "phoenix-heex", scheme: "file" },
      { language: "phoenix-heex", scheme: "untitled" },
      { language: "surface", scheme: "file" },
      { language: "surface", scheme: "untitled" },
    ],
  };

  const client = new LanguageClient(
    "lexical",
    "Lexical",
    serverOptions,
    clientOptions
  );

  await client
    .start()
    .then(() => {
      console.log("Started Lexical");
    })
    .catch((reason) => {
      window.showWarningMessage(`Failed to start Lexical: ${reason}`);
    });
}
