// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, workspace } from "vscode";
import LanguageServer from "./language-server";
import Configuration from "./configuration";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: ExtensionContext): Promise<void> {
	const releasePath = await maybeAutoInstall(context);

	await LanguageServer.start(releasePath);
}

// This method is called when your extension is deactivated
export function deactivate(): void {}

async function maybeAutoInstall(context: ExtensionContext): Promise<string> {
	const releasePathOverride = Configuration.getReleasePathOverride();

	if (releasePathOverride !== undefined && releasePathOverride !== "") {
		console.log(
			`Release override path set to "${releasePathOverride}". Skipping auto-install.`
		);

		return releasePathOverride as string;
	}

	console.log("Release override path is undefined, starting auto-install.");

	return await LanguageServer.install(context);
}
