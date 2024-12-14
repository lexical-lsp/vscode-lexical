import { describe, expect, jest, test } from "@jest/globals";
import { URI } from "vscode-uri";
import Configuration from "../configuration";
import WorkspaceFixture from "./fixtures/workspace-fixture";

describe("Configuration", () => {
	test("getProjectDirUri returns the workspace URI when project dir is not configured", () => {
		const getConfigMock = jest.fn().mockReturnValue(undefined);
		const workspace = WorkspaceFixture.withUri(URI.file("/stub"));
		const projectDirUri = Configuration.getProjectDirUri(
			getConfigMock,
			workspace,
		);

		expect(projectDirUri).toEqual(workspace.workspaceFolders![0].uri);
	});

	test("getProjectDirUri returns the full directory URI when project dir is configured", () => {
		const getConfigMock = jest.fn().mockReturnValue("subdirectory");
		const workspace = WorkspaceFixture.withUri(URI.file("/stub"));
		const projectDirUri = Configuration.getProjectDirUri(
			getConfigMock,
			workspace,
		);

		expect(projectDirUri).toEqual(URI.file("/stub/subdirectory"));
	});
});
