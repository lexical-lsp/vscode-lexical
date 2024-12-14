import { window } from "vscode";
import Configuration from "./configuration";
import ReleaseVersion from "./release/version";

namespace Notifications {
	export function notifyAutoInstallSuccess(version: ReleaseVersion.T): void {
		const disableNotificationMessage = "Disable this notification";
		const serializedVersion = ReleaseVersion.serialize(version);
		const releaseUrl = `https://github.com/lexical-lsp/lexical/releases/tag/v${serializedVersion}`;
		const message = `Lexical was automatically updated to version ${serializedVersion}. See [what's new](${releaseUrl}).`;

		window
			.showInformationMessage(message, disableNotificationMessage)
			.then((fulfilledValue) => {
				if (fulfilledValue === disableNotificationMessage) {
					Configuration.disableAutoInstallUpdateNotification();
				}
			});
	}
}

export default Notifications;
