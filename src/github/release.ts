namespace GithubRelease {
	export interface T {
		name: string | null;
		assets: Asset[];
	}

	export interface Asset {
		browser_download_url: string;
		name: string;
	}
}

export default GithubRelease;
