// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, commands, window } from "vscode";
import LanguageServer from "./language-server";
import Configuration from "./configuration";
import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
} from "vscode-languageclient/node";
import { join } from "path";
import * as fs from "fs";
import Commands from "./commands";
import restartServer from "./commands/restart-server";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: ExtensionContext): Promise<void> {
	const startScriptOrReleaseFolderPath = await maybeAutoInstall(context);

	if (startScriptOrReleaseFolderPath !== undefined) {
		const client = await start(startScriptOrReleaseFolderPath);

		const registerCommand = Commands.getRegisterFunction((id, handler) => {
			context.subscriptions.push(commands.registerCommand(id, handler));
		});

		if (client !== undefined) {
			registerCommand(restartServer, {
				client,
				showWarning: window.showWarningMessage,
			});
		}
	}
}

// This method is called when your extension is deactivated
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate(): void {}

async function maybeAutoInstall(
	context: ExtensionContext
): Promise<string | undefined> {
	const releasePathOverride = Configuration.getReleasePathOverride();

	if (releasePathOverride !== undefined && releasePathOverride !== "") {
		console.log(
			`Release override path set to "${releasePathOverride}". Skipping auto-install.`
		);

		return releasePathOverride as string;
	}

	console.log("Release override path is undefined, starting auto-install.");

	return await LanguageServer.install(
		context.globalStorageUri,
		window.showErrorMessage
	);
}

function isExecutableFile(path: fs.PathLike): boolean {
	const stat = fs.lstatSync(path);
	let hasExecuteAccess = false;
	try {
		fs.accessSync(path, fs.constants.X_OK);
		hasExecuteAccess = true;
	} catch (e) {
		hasExecuteAccess = false;
	}
	return stat.isFile() && hasExecuteAccess;
}

async function start(
	startScriptOrReleaseFolderPath: string
): Promise<LanguageClient | undefined> {
	const outputChannel = window.createOutputChannel("Lexical");
	const startScriptPath = isExecutableFile(startScriptOrReleaseFolderPath)
		? startScriptOrReleaseFolderPath
		: join(startScriptOrReleaseFolderPath, "start_lexical.sh");

	const serverOptions: ServerOptions = {
		command: startScriptPath,
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
		],
	};

	const client = new LanguageClient(
		"lexical",
		"Lexical",
		serverOptions,
		clientOptions
	);

	outputChannel.appendLine(
		`Starting lexical release in "${startScriptOrReleaseFolderPath}"`
	);

	try {
		await client.start();
	} catch (reason) {
		window.showWarningMessage(`Failed to start Lexical: ${reason}`);
		return undefined;
	}

	return client;
}
