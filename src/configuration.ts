import path = require("path");
import { ConfigurationTarget, workspace as vsWorkspace } from "vscode";
import { URI } from "vscode-uri";
import Logger from "./logger";

namespace Configuration {
	type GetConfig = (section: string) => unknown;

	export function getReleasePathOverride(
		getConfig: GetConfig,
		workspace: typeof vsWorkspace,
	): string | undefined {
		const releasePath = getConfig("releasePathOverride") as string | undefined;

		if (!releasePath) {
			return undefined;
		} else if (path.isAbsolute(releasePath)) {
			return releasePath;
		} else {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const workspacePath = workspace.workspaceFolders![0].uri.path;
			return path.join(workspacePath, releasePath);
		}
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

	export function disableAutoInstallUpdateNotification(): void {
		vsWorkspace
			.getConfiguration("lexical")
			.update("notifyOnServerAutoUpdate", false, ConfigurationTarget.Global)
			.then(undefined, (e) => Logger.error(e.toString()));
	}

	export function getAutoInstallUpdateNotification(): boolean {
		return vsWorkspace
			.getConfiguration("lexical")
			.get("notifyOnServerAutoUpdate", true);
	}
}

export default Configuration;
