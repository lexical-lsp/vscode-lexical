// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, window } from "vscode";
import * as LanguageServer from "./language-server";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext): void {
	LanguageServer.install(context).then(() => LanguageServer.start(context));
}

// This method is called when your extension is deactivated
export function deactivate(): void {}
