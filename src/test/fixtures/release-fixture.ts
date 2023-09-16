import { URI } from "vscode-uri";
import Release from "../../release";
import ReleaseVersionFixture from "./release-version-fixture";

namespace ReleaseFixture {
	export function any(overloads: Partial<Release.T>): Release.T {
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
}

export default ReleaseFixture;
