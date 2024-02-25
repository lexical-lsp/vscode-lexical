import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import axios from "axios";
import Github from "../github";
import GithubReleaseFixture from "./fixtures/github-release-fixture";
import ReleaseVersion from "../release/version";
import { URI } from "vscode-uri";
import { mockResolvedValue } from "./utils/strict-mocks";
import ReleaseFixture from "./fixtures/release-fixture";

jest.mock("axios");

describe("fetchLatestRelease", () => {
	beforeEach(() => {
		mockResolvedValue(axios, "get", { data: GithubReleaseFixture.any() });
	});

	test("downloads the latest release from Github", async () => {
		await Github.fetchLatestRelease();

		expect(axios.get).toHaveBeenCalledWith(
			"https://api.github.com/repos/lexical-lsp/lexical/releases/latest",
			{ headers: { accept: "application/vnd.github+json" } },
		);
	});

	test("returns a lexical release", async () => {
		mockResolvedValue(axios, "get", {
			data: {
				name: "0.0.1",
				assets: [
					{ name: "lexical.zip", browser_download_url: "https://example.com" },
				],
			},
		});
		const release = await Github.fetchLatestRelease();

		expect(release).toEqual({
			name: "0.0.1",
			version: ReleaseVersion.deserialize("0.0.1"),
			archiveUrl: URI.parse("https://example.com"),
		});
	});
});

describe("downloadZip", () => {
	beforeEach(() => {
		mockResolvedValue(axios, "get", { data: {} });
	});

	test("it should download the zip from github", async () => {
		const release = ReleaseFixture.create({
			archiveUrl: URI.parse("https://example.com"),
		});
		await Github.downloadZip(release);

		expect(axios.get).toHaveBeenCalledWith("https://example.com/", {
			responseType: "arraybuffer",
		});
	});

	test("it should return the downloaded zip", async () => {
		const someBuffer = "some random data";
		mockResolvedValue(axios, "get", { data: someBuffer });
		const release = ReleaseFixture.create({
			archiveUrl: URI.parse("https://example.com"),
		});
		const buffer = await Github.downloadZip(release);

		expect(buffer).toEqual(someBuffer);
	});
});
