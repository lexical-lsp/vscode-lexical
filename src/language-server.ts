import axios from "axios";
import * as fs from "fs";
import { ExtensionContext, ProgressLocation, Uri, window } from "vscode";
import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
} from "vscode-languageclient/node";
import * as unzipper from "unzipper";
import { join } from "path";
import InstallationManifest from "./installation-manifest";
import Github from "./github";
import Release from "./release";

namespace LanguageServer {
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
		const lexicalInstallationDirectoryUri =
			getLexicalInstallationDirectoryUri(context);
		const lexicalZipUri = getLexicalZipUri(lexicalInstallationDirectoryUri);
		const lexicalReleaseUri = getLexicalReleaseUri(
			lexicalInstallationDirectoryUri
		);

		ensureInstallationDirectoryExists(context);

		const latestRelease = await fetchLatestRelease();
		const installationManifest = InstallationManifest.fetch(
			lexicalInstallationDirectoryUri
		);

		if (
			installationManifest !== undefined &&
			isInstalledReleaseLatest(installationManifest, latestRelease)
		) {
			console.log(
				"Latest release is already installed. Skipping auto-install."
			);
			return lexicalReleaseUri.fsPath;
		}

		return window.withProgress(
			{
				title: "Installing Lexical server...",
				location: ProgressLocation.Notification,
			},
			async (progress) => {
				progress.report({ message: "Downloading Lexical release" });

				const zipBuffer = await downloadZip(latestRelease);

				progress.report({ message: "Installing..." });

				console.log(`Writing zip archive to ${lexicalZipUri.fsPath}`);
				fs.writeFileSync(lexicalZipUri.fsPath, zipBuffer, "binary");

				await extractZip(lexicalZipUri, lexicalReleaseUri);

				InstallationManifest.write(
					lexicalInstallationDirectoryUri,
					latestRelease
				);

				return lexicalReleaseUri.fsPath;
			}
		);
	}

	function isInstalledReleaseLatest(
		installationManifest: InstallationManifest.T,
		latestRelease: Release.T
	): boolean {
		return installationManifest.installedVersion >= latestRelease.version;
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

	async function fetchLatestRelease(): Promise<Release.T> {
		const latestRelease = (
			await axios.get<Github.Release>(
				"https://api.github.com/repos/lexical-lsp/lexical/releases/latest",
				{ headers: { accept: "application/vnd.github+json" } }
			)
		).data;

		console.log(`Latest release is "${latestRelease.name}"`);

		return Release.fromGithubRelease(latestRelease);
	}

	async function downloadZip(
		release: Release.T
	): Promise<NodeJS.ArrayBufferView> {
		console.log(
			`Downloading lexical archive from github with path "${release.archiveUrl}"`
		);

		const zipArrayBuffer = (
			await axios.get<NodeJS.ArrayBufferView>(release.archiveUrl.toString(), {
				responseType: "arraybuffer",
			})
		).data;

		return zipArrayBuffer;
	}

	function ensureInstallationDirectoryExists(context: ExtensionContext): void {
		const installDirUri = getLexicalInstallationDirectoryUri(context);

		if (!fs.existsSync(installDirUri.fsPath)) {
			fs.mkdirSync(installDirUri.fsPath, { recursive: true });
		}
	}

	async function extractZip(zipUri: Uri, releaseUri: Uri): Promise<void> {
		console.log(`Extracting zip archive to ${releaseUri.fsPath}`);
		await new Promise((resolve, reject) => {
			fs.createReadStream(zipUri.fsPath)
				.pipe(unzipper.Extract({ path: releaseUri.fsPath }))
				.on("close", () => {
					resolve(undefined);
				})
				.on("error", (err) => {
					console.error(err);
					reject(err);
				});
		});

		fs.chmodSync(Uri.joinPath(releaseUri, "start_lexical.sh").fsPath, 0o755);
		fs.chmodSync(Uri.joinPath(releaseUri, "bin", "lexical").fsPath, 0o755);
		fs.chmodSync(
			Uri.joinPath(releaseUri, "releases", "0.1.0", "elixir").fsPath,
			0o755
		);
		fs.chmodSync(
			Uri.joinPath(releaseUri, "releases", "0.1.0", "iex").fsPath,
			0o755
		);
	}
}

export default LanguageServer;
