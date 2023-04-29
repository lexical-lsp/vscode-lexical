import axios from "axios";
import * as fs from "fs";
import { ExtensionContext, ProgressLocation, Uri, window } from "vscode";
import { LanguageClient, LanguageClientOptions, ServerOptions } from "vscode-languageclient/node";
import * as unzipper from 'unzipper';
import { join } from "path";
import * as InstallationManifest from "./installation-manifest";
import { Release } from "./github";

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
	const lexicalInstallationDirectoryUri = getLexicalInstallationDirectoryUri(context);
	const lexicalZipUri = getLexicalZipUri(lexicalInstallationDirectoryUri);
	const lexicalReleaseUri = getLexicalReleaseUri(lexicalInstallationDirectoryUri);

	return window.withProgress({
		title: 'Installing Lexical server...',
		location: ProgressLocation.Notification
	}, async progress => {
		ensureInstallationDirectoryExists(context);
    
		progress.report({ message: 'Downloading Lexical release'});

		const [zipBuffer, version] = await downloadZip();

		progress.report({ message: 'Installing...'});

		console.log(`Writing zip archive to ${lexicalZipUri.fsPath}`);
		fs.writeFileSync(lexicalZipUri.fsPath, zipBuffer, 'binary');

		await extractZip(lexicalZipUri, lexicalReleaseUri);
    InstallationManifest.write(lexicalInstallationDirectoryUri, version);

    return lexicalReleaseUri.fsPath;
	});
}

function getLexicalInstallationDirectoryUri(context: ExtensionContext): Uri {
	return Uri.joinPath(context.globalStorageUri, "lexical_install");
}

function getLexicalZipUri(installDirUri: Uri): Uri {
	return Uri.joinPath(installDirUri, `lexical.zip`);
}

function getLexicalReleaseUri(installDirUri: Uri): Uri {
	return Uri.joinPath(installDirUri, `lexical`);
}

async function downloadZip(): Promise<[NodeJS.ArrayBufferView, Date]> {
	const latestRelease = (await axios.get<Release>("https://api.github.com/repos/lexical-lsp/lexical/releases/latest", { headers: { accept: "application/vnd.github+json" }})).data;

	if (latestRelease.name === null) {
		throw new Error("Latest Lexical release does not have a name. Cannot proceed with auto-install.");
	}

	console.log(`Latest release is "${latestRelease.name}"`);
	
	const zipAsset = latestRelease.assets.find(asset => asset.name === 'lexical.zip');

	if (zipAsset === undefined) {
		throw new Error(`Release ${latestRelease.name} did not contain the expected assets. Cannot proceed with auto-install.`);	
	}

	const zipUrl = zipAsset.browser_download_url;
	console.log(`Downloading lexical archive from github with path "${zipUrl}"`);

	const zipArrayBuffer = (await axios.get<NodeJS.ArrayBufferView>(zipUrl, { responseType: 'arraybuffer'})).data;

	const version = new Date(latestRelease.name + '.000Z');

	return [zipArrayBuffer, version];
}

function ensureInstallationDirectoryExists(context: ExtensionContext): void {
	const installDirUri = getLexicalInstallationDirectoryUri(context);

	if (!fs.existsSync(installDirUri.fsPath)) {
		fs.mkdirSync(installDirUri.fsPath, { recursive: true	});
	}
}

async function extractZip(zipUri: Uri, releaseUri: Uri): Promise<void> {
	console.log(`Extracting zip archive to ${releaseUri.fsPath}`);
	await new Promise((resolve, reject) => {
		fs.createReadStream(zipUri.fsPath)
			.pipe(unzipper.Extract({ path: releaseUri.fsPath }))
			.on('close', () => {
				resolve(undefined);
			})
			.on('error', (err) => {
				console.error(err);
				reject(err);
			});
	});
	

	fs.chmodSync(Uri.joinPath(releaseUri, 'start_lexical.sh').fsPath, 0o755);
	fs.chmodSync(Uri.joinPath(releaseUri, 'bin', 'lexical').fsPath, 0o755);
	fs.chmodSync(Uri.joinPath(releaseUri, 'releases', '0.1.0', 'elixir').fsPath, 0o755);
	fs.chmodSync(Uri.joinPath(releaseUri, 'releases', '0.1.0', 'iex').fsPath, 0o755);
}
