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

	test("getReleasePathOverride returns undefined when no releasePathOverride is configured", () => {
		const getConfigMock = jest.fn().mockReturnValue(undefined);
		const workspace = WorkspaceFixture.withUri(URI.file("/stub"));
		const releasePathOverride = Configuration.getReleasePathOverride(
			getConfigMock,
			workspace,
		);

		expect(releasePathOverride).toBeUndefined();
	});

	test("getReleasePathOverride returns the path as configured when it is asolute", () => {
		const absolutePath = "/an/absolute/path";
		const getConfigMock = jest.fn().mockReturnValue(absolutePath);
		const workspace = WorkspaceFixture.withUri(URI.file("/stub"));
		const releasePathOverride = Configuration.getReleasePathOverride(
			getConfigMock,
			workspace,
		);

		expect(releasePathOverride).toBe(absolutePath);
	});

	test.each([
		["./a/relative/path", "/my/workspace", "/my/workspace/a/relative/path"],
		["../a/relative/path", "/my/workspace", "/my/a/relative/path"],
		["a/relative/path", "/my/workspace", "/my/workspace/a/relative/path"],
	])(
		"getReleasePathOverride returns the workspace path joined with the release path when it is relative (%s)",
		(releasePath, workspacePath, expectedPath) => {
			const getConfigMock = jest.fn().mockReturnValue(releasePath);
			const workspace = WorkspaceFixture.withUri(URI.file(workspacePath));
			const releasePathOverride = Configuration.getReleasePathOverride(
				getConfigMock,
				workspace,
			);

			expect(releasePathOverride).toBe(expectedPath);
		},
	);
});
