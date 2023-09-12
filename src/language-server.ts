import axios from "axios";
import * as fs from "fs";
import { ExtensionContext, ProgressLocation, window } from "vscode";
import InstallationManifest from "./installation-manifest";
import Github from "./github";
import Release from "./release";
import ReleaseVersion from "./release/version";
import Paths from "./paths";
import Zip from "./zip";

namespace LanguageServer {
	export async function install(context: ExtensionContext): Promise<string> {
		const installationDirectoryUri = Paths.getInstallationDirectoryUri(
			context.globalStorageUri
		);
		const zipUri = Paths.getZipUri(context.globalStorageUri);
		const releaseUri = Paths.getReleaseUri(context.globalStorageUri);

		ensureInstallationDirectoryExists(context);

		const latestRelease = await fetchLatestRelease();
		const installationManifest = InstallationManifest.fetch(
			installationDirectoryUri
		);

		if (
			installationManifest !== undefined &&
			isInstalledReleaseLatest(installationManifest, latestRelease)
		) {
			console.log(
				"Latest release is already installed. Skipping auto-install."
			);
			return Paths.getStartScriptUri(releaseUri, latestRelease.version).fsPath;
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

				console.log(`Writing zip archive to ${zipUri.fsPath}`);
				fs.writeFileSync(zipUri.fsPath, zipBuffer, "binary");

				await Zip.extract(zipUri, releaseUri, latestRelease.version);

				InstallationManifest.write(installationDirectoryUri, latestRelease);

				return Paths.getStartScriptUri(releaseUri, latestRelease.version)
					.fsPath;
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
		const installDirUri = Paths.getInstallationDirectoryUri(
			context.globalStorageUri
		);

		if (!fs.existsSync(installDirUri.fsPath)) {
			fs.mkdirSync(installDirUri.fsPath, { recursive: true });
		}
	}
}

export default LanguageServer;
