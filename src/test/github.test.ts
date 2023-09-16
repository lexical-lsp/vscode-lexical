import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import axios from "axios";
import Github from "../github";
import GithubReleaseFixture from "./fixtures/github-release-fixture";
import ReleaseVersion from "../release/version";
import { URI } from "vscode-uri";

jest.mock("axios");

describe("fetchLatestRelease", () => {
	beforeEach(() => {
		asMocked(axios.get).mockResolvedValue({ data: GithubReleaseFixture.any() });
	});

	test("downloads the latest release from Github", async () => {
		await Github.fetchLatestRelease();

		expect(axios.get).toHaveBeenCalledWith(
			"https://api.github.com/repos/lexical-lsp/lexical/releases/latest",
			{ headers: { accept: "application/vnd.github+json" } }
		);
	});

	test("returns a lexical release", async () => {
		asMocked(axios.get).mockResolvedValue({
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

function asMocked<F extends (...args: any) => unknown>(
	fun: F
): jest.MockedFunction<F> {
	return fun as jest.MockedFunction<F>;
}
