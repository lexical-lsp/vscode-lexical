import { URI } from "vscode-uri";

import type { workspace as vsWorkspace } from "vscode";

namespace WorkspaceFixture {
	export function withUri(uri: URI): typeof vsWorkspace {
		return {
			workspaceFolders: [{ uri }],
		} as unknown as typeof vsWorkspace;
	}
}

export default WorkspaceFixture;
