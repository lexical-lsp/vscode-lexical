/* eslint-disable @typescript-eslint/naming-convention */

// Raw github types as per official documentation: https://docs.github.com/en/rest?apiVersion=2022-11-28

namespace Github {
	export interface Release {
		name: string | null;
		assets: ReleaseAsset[];
	}

	export interface ReleaseAsset {
		browser_download_url: string;
		name: string;
	}
}

export default Github;
