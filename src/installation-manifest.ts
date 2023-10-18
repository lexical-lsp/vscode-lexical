import { Uri } from "vscode";
import * as fs from "fs";
import Release from "./release";
import ReleaseVersion from "./release/version";

namespace InstallationManifest {
	export interface T {
		installedVersion: ReleaseVersion.T;
	}

	interface RawInstallationManifest {
		installedVersion: string;
	}

	export function write(installDirUri: Uri, release: Release.T): void {
		const installationManifestUri = Uri.joinPath(
			installDirUri,
			"installation_manifest.json",
		);

		const manifest: T = { installedVersion: release.version };
		const rawManifest: RawInstallationManifest = toRaw(manifest);

		console.log(`Latest release installation manifest is`, rawManifest);
		console.log(
			`Writing installation manifest to ${installationManifestUri.fsPath}`,
		);

		fs.writeFileSync(
			installationManifestUri.fsPath,
			JSON.stringify(rawManifest),
		);
	}

	export function fetch(installDirUri: Uri): T | undefined {
		const installationManifestUri = Uri.joinPath(
			installDirUri,
			"installation_manifest.json",
		);

		console.log(
			`Looking for an installation manifest at path ${installationManifestUri.fsPath}`,
		);

		if (!fs.existsSync(installationManifestUri.fsPath)) {
			console.log("No installation manifest found");
			return undefined;
		}

		const rawManifest = JSON.parse(
			fs.readFileSync(installationManifestUri.fsPath).toString(),
		);

		console.log("Fetched the following manifest", rawManifest);

		if (isValid(rawManifest)) {
			return fromRaw(rawManifest);
		}

		console.warn("Fetched manifest is invalid. Returning no manifest.");
		return undefined;
	}

	export function isInstalledVersionGreaterThan(
		manifest: T,
		releaseVersion: ReleaseVersion.T,
	): boolean {
		return ReleaseVersion.gte(manifest.installedVersion, releaseVersion);
	}

	function isValid(
		rawManifest: unknown,
	): rawManifest is RawInstallationManifest {
		return (
			typeof rawManifest === "object" &&
			rawManifest !== null &&
			"installedVersion" in rawManifest &&
			typeof rawManifest.installedVersion === "string" &&
			ReleaseVersion.isValid(rawManifest.installedVersion)
		);
	}

	function toRaw(manifest: T): RawInstallationManifest {
		return {
			installedVersion: ReleaseVersion.serialize(manifest.installedVersion),
		};
	}

	function fromRaw(manifest: RawInstallationManifest): T {
		return {
			installedVersion: ReleaseVersion.deserialize(manifest.installedVersion),
		};
	}
}

export default InstallationManifest;
