import { Uri } from "vscode";
import ReleaseVersion from "./release/version";
import * as fs from "fs";
import * as os from "os";

namespace Paths {
	export function getInstallationDirectoryUri(globalStorageUri: Uri): Uri {
		const installationDirectory = Uri.joinPath(
			globalStorageUri,
			"lexical_install",
		);
		ensureDirectoryExists(installationDirectory);
		return installationDirectory;
	}

	export function getReleaseUri(globalStorageUri: Uri): Uri {
		return Uri.joinPath(
			getInstallationDirectoryUri(globalStorageUri),
			"lexical",
		);
	}

	export function getStartScriptUri(
		releaseUri: Uri,
		version: ReleaseVersion.T,
	): Uri {
		if (ReleaseVersion.usesNewPackaging(version)) {
			return Uri.joinPath(releaseUri, "bin", "start_lexical.sh");
		}

		return Uri.joinPath(releaseUri, "start_lexical.sh");
	}

	export function getZipUri(): Uri {
		const tempDirUri = getTempDirUri();
		return Uri.joinPath(tempDirUri, "lexical.zip");
	}

	function getTempDirUri(): Uri {
		const path = fs.realpathSync(os.tmpdir());
		const tmpDirUri = Uri.file(path);
		const lexicalTmpDir = Uri.joinPath(tmpDirUri, "vscode-lexical");
		ensureDirectoryExists(lexicalTmpDir);
		return lexicalTmpDir;
	}

	function ensureDirectoryExists(directory: Uri): void {
		if (!fs.existsSync(directory.fsPath)) {
			fs.mkdirSync(directory.fsPath, { recursive: true });
		}
	}
}

export default Paths;
