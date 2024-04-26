import {
	commands,
	extensions,
	Range,
	SnippetString,
	window,
} from "vscode";

import {
	ExecuteCommandParams,
	LanguageClient,
} from "vscode-languageclient/node";
import Commands from ".";

interface Context {
	client: LanguageClient;
	showWarning: (message: string) => void;
}

const extractFunction: Commands.T<Context> = {
	id: "extension.extractFunction",
	createHandler: ({ client, showWarning }) => {
		async function handle() {
			const extension = extensions.getExtension("lexical-lsp.lexical");
			const editor = window.activeTextEditor;
			if (!extension || !editor || !client) {
				return;
			}

			const command =
				client.initializeResult!.capabilities.executeCommandProvider!.commands.find(
					(c: string) => c.startsWith("extractFunction")
				)!;
			if (!command) {
				return;
			}

			const uriStr = editor.document.uri.toString();
			const { start, end } = editor.selection;
			const args = [uriStr, start.line, end.line, "extracted_function"];
			const params: ExecuteCommandParams = { command, arguments: args };
			await client.sendRequest("workspace/executeCommand", params);

			const editor2 = window.activeTextEditor;
			if (!editor2) {
				return;
			}
			const document = editor2.document;
			const text = document.getText();
			const startIndex = text.indexOf("extracted_function");
			const endIndex = text.lastIndexOf("extracted_function");

			if (startIndex !== -1 && endIndex !== -1) {
				const startPosition = document.positionAt(startIndex);
				const endPosition = document.positionAt(
					endIndex + "extracted_function".length
				);
				const range = new Range(startPosition, endPosition);
				const toReplace = document.getText(range);
				// Use snippet to allow user to input the new function name
				const snippet = toReplace
					.replace("extracted_function", "${1:function_extracted}$0")
					.replace("extracted_function", "${1:function_extracted}")
					.replace(/function_extracted/g, "extracted_function")
					.replace(/^ +/gm, "");
				editor2.insertSnippet(new SnippetString(snippet), range);
				// insertSnippet breaks whitspace formatting, so we run format cmd:
				commands.executeCommand("editor.action.formatDocument");
			}
		}

		return handle;
	},
};

export default extractFunction;
