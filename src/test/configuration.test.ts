import { describe, test, jest, expect } from "@jest/globals";
import Configuration from "../configuration";
import { URI } from "vscode-uri";
import WorkspaceFixture from "./fixtures/workspace-fixture";

describe("Configuration", () => {
	test("getProjectDirUri returns the workspace URI when project dir is not configured", () => {
		const getConfigMock = jest.fn().mockReturnValue(undefined);
		const workspace = WorkspaceFixture.withUri(URI.file("/stub"));
		const projectDirUri = Configuration.getProjectDirUri(
			getConfigMock,
			workspace
		);

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(projectDirUri).toEqual(workspace.workspaceFolders![0].uri);
	});

	test("getProjectDirUri returns the full directory URI when project dir is configured", () => {
		const getConfigMock = jest.fn().mockReturnValue("subdirectory");
		const workspace = WorkspaceFixture.withUri(URI.file("/stub"));
		const projectDirUri = Configuration.getProjectDirUri(
			getConfigMock,
			workspace
		);

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(projectDirUri).toEqual(URI.file("/stub/subdirectory"));
	});
});
