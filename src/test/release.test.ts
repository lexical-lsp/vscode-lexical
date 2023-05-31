import { describe, expect, jest, test } from "@jest/globals";
import Github from "../github";
import Release from "../release";
import { URI } from "vscode-uri";

jest.mock("vscode", () => {
	const localUri = import("vscode-uri");
	return { Uri: localUri };
});

describe("fromGithubRelease", () => {
	test("should throw given github release without a name", () => {
		const githubRelease: Github.Release = {
			name: null,
			assets: [],
		};

		expect(() => Release.fromGithubRelease(githubRelease)).toThrow();
	});

	test("should throw given github release name is not an ISO 8601 timestamp without milliseconds", () => {
		const githubRelease: Github.Release = {
			name: "hello",
			assets: [],
		};

		expect(() => Release.fromGithubRelease(githubRelease)).toThrow();
	});

	test("should throw given github release does not have a lexical release asset", () => {
		const githubRelease: Github.Release = {
			name: "2023-05-27T15:48:20",
			assets: [],
		};

		expect(() => Release.fromGithubRelease(githubRelease)).toThrow();
	});

	test("should create a release", () => {
		const githubRelease: Github.Release = {
			name: "2023-05-27T15:48:20",
			assets: [
				{ name: "lexical.zip", browser_download_url: "https://example.com" },
			],
		};

		const release = Release.fromGithubRelease(githubRelease);

		const expected: Release.T = {
			name: githubRelease.name!,
			version: new Date(githubRelease.name! + ".000Z"),
			archiveUrl: URI.parse(githubRelease.assets[0].browser_download_url),
		};
		expect(release).toEqual(expected);
	});
});
