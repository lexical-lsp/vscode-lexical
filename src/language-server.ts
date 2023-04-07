import axios from "axios";
import * as fs from "fs";
import { ExtensionContext, ProgressLocation, Uri, window } from "vscode";
import { LanguageClient, LanguageClientOptions, ServerOptions } from "vscode-languageclient/node";
import * as unzipper from 'unzipper';
import { join } from "path";

export async function start(releasePath: string): Promise<void> {
	const outputChannel = window.createOutputChannel("Lexical");

	const startScriptPath = join(releasePath, "start_lexical.sh");

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

  outputChannel.appendLine(`Starting lexical release in "${releasePath}"`);

	await client
		.start()
		.then(() => {
			console.log("Started Lexical");
		})
		.catch((reason) => {
			window.showWarningMessage(`Failed to start Lexical: ${reason}`);
		});
}

export async function install(context: ExtensionContext): Promise<string> {
	return window.withProgress({
		title: 'Installing Lexical server...',
		location: ProgressLocation.Notification
	}, async progress => {
		const lexicalZipUri = getLexicalZipUri(context);
		const lexicalReleaseUri = getLexicalReleaseUri(context);

		ensureInstallationDirectoryExists(context);
    
		progress.report({ message: 'Downloading Lexical executable'});

		await downloadZip(lexicalZipUri);

		progress.report({ message: 'Installing...'});

		extractZip(lexicalZipUri, lexicalReleaseUri);

    return lexicalReleaseUri.fsPath;
	});
}

function getLexicalInstallationDirectoryUri(context: ExtensionContext): Uri {
	return Uri.joinPath(context.globalStorageUri, "lexical_install");
}

function getLexicalZipUri(context: ExtensionContext): Uri {
	const installDirUri = getLexicalInstallationDirectoryUri(context);
	return Uri.joinPath(installDirUri, `lexical.zip`);
}

function getLexicalReleaseUri(context: ExtensionContext): Uri {
	const installDirUri = getLexicalInstallationDirectoryUri(context);
	return Uri.joinPath(installDirUri, `lexical`);
}

async function downloadZip(zipUri: Uri): Promise<void> {
	const response = await axios.get(`https://lexical-release.s3.ca-central-1.amazonaws.com/lexical.zip`, { responseType: 'arraybuffer'});

	fs.writeFileSync(zipUri.fsPath, response.data, 'binary');
}

function ensureInstallationDirectoryExists(context: ExtensionContext): void {
	const installDirUri = getLexicalInstallationDirectoryUri(context);

	if (!fs.existsSync(installDirUri.fsPath)) {
		fs.mkdirSync(installDirUri.fsPath);
	}
}

function extractZip(zipUri: Uri, releaseUri: Uri): void {
	fs.createReadStream(zipUri.fsPath)
		.pipe(unzipper.Extract({ path: releaseUri.fsPath }));

	fs.chmodSync(Uri.joinPath(releaseUri, 'start_lexical.sh').fsPath, 0o755);
	fs.chmodSync(Uri.joinPath(releaseUri, 'bin', 'lexical').fsPath, 0o755);
	fs.chmodSync(Uri.joinPath(releaseUri, 'releases', '0.1.0', 'elixir').fsPath, 0o755);
	fs.chmodSync(Uri.joinPath(releaseUri, 'releases', '0.1.0', 'iex').fsPath, 0o755);
}
