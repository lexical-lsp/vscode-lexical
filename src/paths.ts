import { Uri } from "vscode";
import ReleaseVersion from "./release/version";

namespace Paths {
	export function getInstallationDirectoryUri(globalStorageUri: Uri): Uri {
		return Uri.joinPath(globalStorageUri, "lexical_install");
	}

	export function getZipUri(globalStorageUri: Uri): Uri {
		return Uri.joinPath(
			getInstallationDirectoryUri(globalStorageUri),
			`lexical.zip`
		);
	}

	export function getReleaseUri(globalStorageUri: Uri): Uri {
		return Uri.joinPath(
			getInstallationDirectoryUri(globalStorageUri),
			`lexical`
		);
	}

	export function getStartScriptUri(
		releaseUri: Uri,
		version: ReleaseVersion.T
	): Uri {
		if (ReleaseVersion.usesNewPackaging(version)) {
			return Uri.joinPath(releaseUri, "bin", "start_lexical.sh");
		}

		return Uri.joinPath(releaseUri, "start_lexical.sh");
	}
}

export default Paths;
