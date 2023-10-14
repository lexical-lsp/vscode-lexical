import { ProgressLocation, Uri, window } from "vscode";
import InstallationManifest from "./installation-manifest";
import Github from "./github";
import Paths from "./paths";
import AutoInstaller from "./auto-installer";

namespace LanguageServer {
	export async function install(globalStorageUri: Uri): Promise<string> {
		const installationDirectoryUri =
			Paths.getInstallationDirectoryUri(globalStorageUri);
		const releaseUri = Paths.getReleaseUri(globalStorageUri);

		const latestRelease = await Github.fetchLatestRelease();

		if (
			AutoInstaller.isInstalledReleaseLatest(
				installationDirectoryUri,
				latestRelease
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
				await AutoInstaller.install(progress, latestRelease, releaseUri);

				InstallationManifest.write(installationDirectoryUri, latestRelease);

				return Paths.getStartScriptUri(releaseUri, latestRelease.version)
					.fsPath;
			}
		);
	}
}

export default LanguageServer;
