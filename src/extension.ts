// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, commands, window, workspace } from "vscode";
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
import { URI } from "vscode-uri";
import Logger from "./logger";
import reindexProject from "./commands/reindex-project";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: ExtensionContext): Promise<void> {
	const startScriptOrReleaseFolderPath = await maybeAutoInstall(context);
	const projectDir = Configuration.getProjectDirUri(getConfig, workspace);

	if (startScriptOrReleaseFolderPath !== undefined) {
		const client = await start(startScriptOrReleaseFolderPath, projectDir);

		const registerCommand = Commands.getRegisterFunction((id, handler) => {
			context.subscriptions.push(commands.registerCommand(id, handler));
		});

		registerCommand(restartServer, { client });
		registerCommand(reindexProject, { client });
	}
}

// This method is called when your extension is deactivated
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate(): void {}

async function maybeAutoInstall(
	context: ExtensionContext,
): Promise<string | undefined> {
	const releasePathOverride = Configuration.getReleasePathOverride(getConfig);

	if (releasePathOverride !== undefined && releasePathOverride !== "") {
		Logger.info(
			`Release override path set to "${releasePathOverride}". Skipping auto-install.`,
		);

		return releasePathOverride as string;
	}

	Logger.info("Release override path is undefined, starting auto-install.");

	return await LanguageServer.install(
		context.globalStorageUri,
		window.showErrorMessage,
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
	startScriptOrReleaseFolderPath: string,
	workspaceUri: URI,
): Promise<LanguageClient> {
	Logger.info(`Starting Lexical in directory ${workspaceUri?.fsPath}`);

	const startScriptPath = isExecutableFile(startScriptOrReleaseFolderPath)
		? startScriptOrReleaseFolderPath
		: join(startScriptOrReleaseFolderPath, "start_lexical.sh");

	const serverOptions: ServerOptions = {
		command: startScriptPath,
	};

	const clientOptions: LanguageClientOptions = {
		outputChannel: Logger.outputChannel(),
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
		workspaceFolder: {
			index: 0,
			uri: workspaceUri,
			name: workspaceUri.path,
		},
	};

	const client = new LanguageClient(
		"lexical",
		"Lexical",
		serverOptions,
		clientOptions,
	);

	Logger.info(
		`Starting lexical release in "${startScriptOrReleaseFolderPath}"`,
	);

	try {
		await client.start();
	} catch (reason) {
		window.showWarningMessage(`Failed to start Lexical: ${reason}`);
	}

	return client;
}

function getConfig(section: string) {
	return workspace.getConfiguration("lexical.server").get(section);
}
