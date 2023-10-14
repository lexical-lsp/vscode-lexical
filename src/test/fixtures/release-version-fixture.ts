import ReleaseVersion from "../../release/version";

namespace ReleaseVersionFixture {
	export function any(): ReleaseVersion.T {
		return ReleaseVersion.deserialize("0.3.0");
	}

	export function thatUsesNewPackaging(): ReleaseVersion.T {
		return ReleaseVersion.deserialize("0.3.0");
	}

	export function thatDoesNotUseNewPackaging(): ReleaseVersion.T {
		return ReleaseVersion.deserialize("0.2.0");
	}
}

export default ReleaseVersionFixture;
