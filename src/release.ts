import Github from './github';
import { Uri } from 'vscode';

namespace Release {
	export interface T {
		name: string
		version: Date
		archiveUrl: Uri
	}

	export function fromGithubRelease(githubRelease: Github.Release): T {
		if (githubRelease.name === null) {
			throw new Error("Github release did not contain a name.");	
		}

		return {
			name: githubRelease.name,
			version: githubReleaseNameToDate(githubRelease.name),
			archiveUrl: findArchiveUri(githubRelease)
		};
	}

	function githubReleaseNameToDate(releaseName: string): Date {
		const date = new Date(releaseName + '.000Z');

		if (date.toString() !== 'Invalid Date') {
			throw new Error(`Release name "${releaseName} is not a valid ISO8601 timestamp without milliseconds.`);
		}

		return date;
	}

	function findArchiveUri(githubRelease: Github.Release): Uri {
		const zipAsset = githubRelease.assets.find(asset => asset.name === 'lexical.zip');

		if (zipAsset === undefined) {
			throw new Error(`Github release ${githubRelease.name} did not contain the expected assets.`);	
		}

		return Uri.parse(zipAsset.browser_download_url);
	}
}

export default Release;
