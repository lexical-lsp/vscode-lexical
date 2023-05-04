import * as vscode from "vscode";
import * as path from "path";

export enum Fixture {
	diagnostics = "diagnostics",
}

/**
 * Activates the vscode.lsp-sample extension
 */
export async function activate(
	fixture: Fixture
): Promise<[vscode.TextDocument, vscode.TextEditor]> {
	const fixturesProjectPath = path.resolve(__dirname, "./fixtures");

	// The extensionId is `publisher.name` from package.json
	const ext = vscode.extensions.getExtension("lexical-lsp.lexical")!;
	await ext.activate();
	try {
		const fixtureFilePath = path.resolve(
			fixturesProjectPath,
			"./lib/",
			`${fixture}.ex`
		);
		console.log(fixtureFilePath);
		const doc = await vscode.workspace.openTextDocument(fixtureFilePath);
		const editor = await vscode.window.showTextDocument(doc);
		await sleep(1500); // Wait for server activation

		return [doc, editor];
	} catch (e) {
		console.error(e);
		throw e;
	}
}

async function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
