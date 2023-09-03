import axios from "axios";
import * as fs from "fs";
import { ExtensionContext, ProgressLocation, Uri, window } from "vscode";
import InstallationManifest from "./installation-manifest";
import Github from "./github";
import Release from "./release";
import ReleaseVersion from "./release/version";
import extract = require("extract-zip");

namespace LanguageServer {
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
			return getLexicalStartScriptPath(lexicalReleaseUri, latestRelease.version)
				.fsPath;
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

				await extractZip(
					lexicalZipUri,
					lexicalReleaseUri,
					latestRelease.version
				);

				InstallationManifest.write(
					lexicalInstallationDirectoryUri,
					latestRelease
				);

				return getLexicalStartScriptPath(
					lexicalReleaseUri,
					latestRelease.version
				).fsPath;
			}
		);
	}

	function isInstalledReleaseLatest(
		installationManifest: InstallationManifest.T,
		latestRelease: Release.T
	): boolean {
		return ReleaseVersion.gte(
			installationManifest.installedVersion,
			latestRelease.version
		);
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

	function getLexicalStartScriptPath(
		releaseUri: Uri,
		version: ReleaseVersion.T
	): Uri {
		if (usesNewPackaging(version)) {
			return Uri.joinPath(releaseUri, "bin", "start_lexical.sh");
		}

		return Uri.joinPath(releaseUri, "start_lexical.sh");
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

	async function extractZip(
		zipUri: Uri,
		releaseUri: Uri,
		version: ReleaseVersion.T
	): Promise<void> {
		console.log(`Extracting zip archive to ${releaseUri.fsPath}`);

		fs.rmSync(releaseUri.fsPath, { recursive: true, force: true });

		const zipDestinationUri = usesNewPackaging(version)
			? Uri.joinPath(releaseUri, "..")
			: releaseUri;

		try {
			await extract(zipUri.fsPath, { dir: zipDestinationUri.fsPath });

			if (usesNewPackaging(version)) {
				addExecutePermission(Uri.joinPath(releaseUri, "bin/start_lexical.sh"));
				addExecutePermission(Uri.joinPath(releaseUri, "bin/debug_shell.sh"));
				addExecutePermission(Uri.joinPath(releaseUri, "priv/port_wrapper.sh"));
			}
		} catch (err) {
			console.error(err);
			throw err;
		}
	}

	function usesNewPackaging(version: ReleaseVersion.T): boolean {
		return ReleaseVersion.gte(version, ReleaseVersion.deserialize("0.3.0"));
	}

	function addExecutePermission(fileUri: Uri): void {
		fs.chmodSync(fileUri.fsPath, 0o755);
	}
}

export default LanguageServer;
