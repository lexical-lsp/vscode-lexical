import { describe, expect, test } from "@jest/globals";
import Release from "../release";
import { URI } from "vscode-uri";
import * as semver from "semver";
import GithubRelease from "../github/release";

describe("fromGithubRelease", () => {
	test("should throw given github release without a name", () => {
		const githubRelease: GithubRelease.T = {
			name: null,
			assets: [],
		};

		expect(() => Release.fromGithubRelease(githubRelease)).toThrow();
	});

	test("should throw given github release name is not valid version", () => {
		const githubRelease: GithubRelease.T = {
			name: "hello",
			assets: [],
		};

		expect(() => Release.fromGithubRelease(githubRelease)).toThrow();
	});

	test("should throw given github release does not have a lexical release asset", () => {
		const githubRelease: GithubRelease.T = {
			name: "2023-05-27T15:48:20",
			assets: [],
		};

		expect(() => Release.fromGithubRelease(githubRelease)).toThrow();
	});

	test("should create a release with a date version", () => {
		const githubReleaseName = "2023-05-27T15:48:20";
		const githubRelease: GithubRelease.T = {
			name: githubReleaseName,
			assets: [
				{ name: "lexical.zip", browser_download_url: "https://example.com" },
			],
		};

		const release = Release.fromGithubRelease(githubRelease);

		const expected: Release.T = {
			name: githubReleaseName,
			version: new Date(githubReleaseName + ".000Z"),
			archiveUrl: URI.parse(githubRelease.assets[0].browser_download_url),
		};
		expect(release).toEqual(expected);
	});

	test("should create a release with a semantic version", () => {
		const githubReleaseName = "v1.2.3";
		const githubRelease: GithubRelease.T = {
			name: githubReleaseName,
			assets: [
				{ name: "lexical.zip", browser_download_url: "https://example.com" },
			],
		};

		const release = Release.fromGithubRelease(githubRelease);

		const expected: Release.T = {
			name: githubReleaseName,
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			version: semver.coerce(githubReleaseName)!,
			archiveUrl: URI.parse(githubRelease.assets[0].browser_download_url),
		};
		expect(release).toEqual(expected);
	});
});
