import GithubRelease from "../../github/release";

namespace GithubReleaseFixture {
	export function any(): GithubRelease.T {
		return {
			name: "0.0.1",
			assets: [{ name: "lexical.zip", browser_download_url: "" }],
		};
	}
}

export default GithubReleaseFixture;
