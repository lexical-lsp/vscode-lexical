import { Uri } from "vscode";
import * as fs from "fs";

export interface InstallationManifest {
	installedVersion: Date
}

interface RawInstallationManifest {
	installedVersion: string
}

export function write(installDirUri: Uri, version: Date): void {
  const installationManifestUri = Uri.joinPath(installDirUri, 'installation_manifest.json');

	const manifest: InstallationManifest = { installedVersion: version };
	const rawManifest: RawInstallationManifest = toRaw(manifest);

	console.log(`Latest release installation manifest is`, rawManifest);
	console.log(`Writing installation manifest to ${installationManifestUri.fsPath}`);

  fs.writeFileSync(installationManifestUri.fsPath, JSON.stringify(rawManifest));
}

export function fetch(installDirUri: Uri): InstallationManifest | undefined {
  const installationManifestUri = Uri.joinPath(installDirUri, 'installation_manifest.json');

	console.log(`Looking for an installation manifest at path ${installationManifestUri}`);

	if (!fs.existsSync(installationManifestUri.fsPath)) {
		console.log('No installation manifest found');
		return undefined;
	}
	
	const rawManifest = JSON.parse(fs.readFileSync(installationManifestUri.fsPath).toString());

	console.log('Fetched the following manifest', rawManifest);
	
	if (isValid(rawManifest)) {
		return fromRaw(rawManifest);
	}

	console.warn('Fetched manifest is invalid. Returning no manifest.');
	return undefined;
}

function isValid(rawManifest: unknown): rawManifest is RawInstallationManifest {
	return typeof rawManifest === 'object'
		&& rawManifest !== null
		&& 'installedVersion' in rawManifest
		&& typeof rawManifest.installedVersion === 'string'
		&& new Date(rawManifest.installedVersion).toString() !== 'Invalid Date';
}

function toRaw(manifest: InstallationManifest): RawInstallationManifest {
	return {
		installedVersion: manifest.installedVersion.toISOString()
	};
}

function fromRaw(manifest: RawInstallationManifest): InstallationManifest {
	return {
		installedVersion: new Date(manifest.installedVersion)
	};
}
