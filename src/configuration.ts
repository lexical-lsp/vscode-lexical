import { workspace } from "vscode";

namespace Configuration {
	export function getReleasePathOverride(): string | undefined {
		return workspace.getConfiguration('lexical.server').get('releasePathOverride');
	}
}

export default Configuration;
