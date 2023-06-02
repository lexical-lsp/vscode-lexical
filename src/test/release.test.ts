import { describe, expect, test } from "@jest/globals";
import Github from "../github";
import Release from "../release";
import { URI } from "vscode-uri";

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
		const githubReleaseName = "2023-05-27T15:48:20";
		const githubRelease: Github.Release = {
			name: githubReleaseName,
			assets: [
				// eslint-disable-next-line @typescript-eslint/naming-convention
				{ name: "lexical.zip", browser_download_url: "https://example.com" },
			],
		};

		const release = Release.fromGithubRelease(githubRelease);

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const expected: Release.T = {
			name: githubReleaseName,
			version: new Date(githubReleaseName + ".000Z"),
			archiveUrl: URI.parse(githubRelease.assets[0].browser_download_url),
		};
		expect(release).toEqual(expected);
	});
});
