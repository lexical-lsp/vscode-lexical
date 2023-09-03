import ReleaseVersion from "../../release/version";

namespace ReleaseVersionFixture {
	export function thatUsesNewPackaging(): ReleaseVersion.T {
		return ReleaseVersion.deserialize("0.3.0");
	}
}

export default ReleaseVersionFixture;
