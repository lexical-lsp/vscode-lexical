import { URI } from "vscode-uri";
import Release from "../../release";
import ReleaseVersionFixture from "./release-version-fixture";
import ReleaseVersion from "../../release/version";

namespace ReleaseFixture {
	export function create(overloads: Partial<Release.T> = {}): Release.T {
		const defaultRelease: Release.T = {
			name: "",
			version: ReleaseVersionFixture.any(),
			archiveUrl: URI.parse("https://example.com"),
		};

		return {
			...defaultRelease,
			...overloads,
		};
	}

	export function withVersion(version: ReleaseVersion.T): Release.T {
		return create({ version });
	}
}

export default ReleaseFixture;
