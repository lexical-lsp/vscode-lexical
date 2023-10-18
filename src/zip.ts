import { Uri } from "vscode";
import extractZip = require("extract-zip");
import * as fs from "fs";
import ReleaseVersion from "./release/version";

namespace Zip {
	export async function extract(
		zipUri: Uri,
		releaseUri: Uri,
		version: ReleaseVersion.T,
	): Promise<void> {
		console.log(`Extracting zip archive to ${releaseUri.fsPath}`);

		fs.rmSync(releaseUri.fsPath, { recursive: true, force: true });

		const zipDestinationUri = ReleaseVersion.usesNewPackaging(version)
			? Uri.joinPath(releaseUri, "..")
			: releaseUri;

		try {
			await extractZip(zipUri.fsPath, { dir: zipDestinationUri.fsPath });

			if (ReleaseVersion.usesNewPackaging(version)) {
				addExecutePermission(Uri.joinPath(releaseUri, "bin/start_lexical.sh"));
				addExecutePermission(Uri.joinPath(releaseUri, "bin/debug_shell.sh"));
				addExecutePermission(Uri.joinPath(releaseUri, "priv/port_wrapper.sh"));
			}
		} catch (err) {
			console.error(err);
			throw err;
		}
	}

	function addExecutePermission(fileUri: Uri): void {
		fs.chmodSync(fileUri.fsPath, 0o755);
	}
}

export default Zip;
