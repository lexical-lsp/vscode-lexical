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
import * as LanguageServer from "./language-server";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  LanguageServer.start(context);
}

// This method is called when your extension is deactivated
export function deactivate() {}
