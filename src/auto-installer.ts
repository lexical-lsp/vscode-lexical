import * as fs from "fs";
import { Progress, Uri } from "vscode";
import Configuration from "./configuration";
import Github from "./github";
import InstallationManifest from "./installation-manifest";
import Logger from "./logger";
import Notifications from "./notifications";
import Paths from "./paths";
import Release from "./release";
import Zip from "./zip";

namespace AutoInstaller {
	export function isInstalledReleaseLatest(
		installationDirectoryUri: Uri,
		latestRelease: Release.T,
	): boolean {
		const installationManifest = InstallationManifest.fetch(
			installationDirectoryUri,
		);
		if (installationManifest === undefined) {
			return false;
		}

		return InstallationManifest.isInstalledVersionGreaterThan(
			installationManifest,
			latestRelease.version,
		);
	}

	export async function install(
		progress: Progress<{ message: string }>,
		latestRelease: Release.T,
		releaseUri: Uri,
	) {
		progress.report({ message: "Downloading Lexical release" });

		const zipBuffer = await Github.downloadZip(latestRelease);

		progress.report({ message: "Installing..." });

		const zipUri = Paths.getZipUri();
		Logger.info(`Writing zip archive to ${zipUri.fsPath}`);
		fs.writeFileSync(zipUri.fsPath, zipBuffer, "binary");

		await Zip.extract(zipUri, releaseUri, latestRelease.version);

		if (Configuration.getAutoInstallUpdateNotification()) {
			Notifications.notifyAutoInstallSuccess(latestRelease.version);
		}
	}
}

export default AutoInstaller;
