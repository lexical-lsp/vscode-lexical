import { Uri } from "vscode";
import * as fs from "fs";

export interface InstallationManifest {
	installed: boolean
}

export function write(installDirUri: Uri): void {
  const installationManifestUri = Uri.joinPath(installDirUri, 'installation_manifest.json');

  fs.writeFileSync(installationManifestUri.fsPath, JSON.stringify({ installed: true }));
}

export function fetch(installDirUri: Uri): InstallationManifest | undefined {
  const installationManifestUri = Uri.joinPath(installDirUri, 'installation_manifest.json');

	if (!fs.existsSync(installationManifestUri.fsPath)) {
		return undefined;
	}
	
	const rawManifest = fs.readFileSync(installationManifestUri.fsPath).toString();

	return JSON.parse(rawManifest);
}
