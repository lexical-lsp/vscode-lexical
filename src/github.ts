import axios from "axios";
import GithubRelease from "./github/release";
import Release from "./release";

// Raw github types as per official documentation: https://docs.github.com/en/rest?apiVersion=2022-11-28

namespace Github {
	export async function fetchLatestRelease(): Promise<Release.T> {
		const latestRelease = (
			await axios.get<GithubRelease.T>(
				"https://api.github.com/repos/lexical-lsp/lexical/releases/latest",
				{ headers: { accept: "application/vnd.github+json" } }
			)
		).data;

		console.log(`Latest release is "${latestRelease.name}"`);

		return Release.fromGithubRelease(latestRelease);
	}

	export async function downloadZip(
		release: Release.T
	): Promise<NodeJS.ArrayBufferView> {
		console.log(
			`Downloading lexical archive from github with path "${release.archiveUrl}"`
		);

		const zipArrayBuffer = (
			await axios.get<NodeJS.ArrayBufferView>(release.archiveUrl.toString(), {
				responseType: "arraybuffer",
			})
		).data;

		return zipArrayBuffer;
	}
}

export default Github;
