import path = require("path");
import type { workspace as vsWorkspace } from "vscode";
import { URI } from "vscode-uri";

namespace Configuration {
	type GetConfig = (section: string) => unknown;

	export function getReleasePathOverride(
		getConfig: GetConfig,
	): string | undefined {
		return getConfig("releasePathOverride") as string | undefined;
	}

	export function getProjectDirUri(
		getConfig: GetConfig,
		workspace: typeof vsWorkspace,
	): URI {
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
}

export default Configuration;
