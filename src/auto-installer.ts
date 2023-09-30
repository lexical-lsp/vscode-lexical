import { Progress, Uri } from "vscode";
import InstallationManifest from "./installation-manifest";
import Release from "./release";
import Github from "./github";
import * as fs from "fs";
import Zip from "./zip";
import Paths from "./paths";

namespace AutoInstaller {
	export function isInstalledReleaseLatest(
		installationDirectoryUri: Uri,
		latestRelease: Release.T
	): boolean {
		const installationManifest = InstallationManifest.fetch(
			installationDirectoryUri
		);
		if (installationManifest === undefined) {
			return false;
		}

		return InstallationManifest.isInstalledVersionGreaterThan(
			installationManifest,
			latestRelease.version
		);
	}

	export async function install(
		progress: Progress<{ message: string }>,
		latestRelease: Release.T,
		releaseUri: Uri
	) {
		progress.report({ message: "Downloading Lexical release" });

		const zipBuffer = await Github.downloadZip(latestRelease);

		progress.report({ message: "Installing..." });

		const zipUri = Paths.getZipUri();
		console.log(`Writing zip archive to ${zipUri.fsPath}`);
		fs.writeFileSync(zipUri.fsPath, zipBuffer, "binary");

		await Zip.extract(zipUri, releaseUri, latestRelease.version);
	}
}

export default AutoInstaller;
