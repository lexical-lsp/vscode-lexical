import * as fs from "fs";
import { ExtensionContext, ProgressLocation, window } from "vscode";
import InstallationManifest from "./installation-manifest";
import Github from "./github";
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

		const latestRelease = await Github.fetchLatestRelease();
		const installationManifest = InstallationManifest.fetch(
			installationDirectoryUri
		);

		if (
			installationManifest !== undefined &&
			InstallationManifest.isInstalledVersionGreaterThan(
				installationManifest,
				latestRelease.version
			)
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

				const zipBuffer = await Github.downloadZip(latestRelease);

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
