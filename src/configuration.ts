import path = require("path");
import { workspace } from "vscode";
import { URI } from "vscode-uri";

namespace Configuration {
	export function getReleasePathOverride(): string | undefined {
		return getConfig("releasePathOverride") as string | undefined;
	}

	export function getProjectDirUri(): URI {
		const projectDirConfig = getConfig("projectDir");

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const workspacePath = workspace.workspaceFolders![0].uri.path;

		if (typeof projectDirConfig === "string") {
			const fullDirectoryPath = path.join(workspacePath, projectDirConfig);
			return URI.file(fullDirectoryPath);
		} else {
			return URI.file(workspacePath);
		}
	}

	function getConfig(section: string) {
		return workspace.getConfiguration("lexical.server").get(section);
	}
}

export default Configuration;
