import { window } from "vscode";
import ReleaseVersion from "./release/version";
import Configuration from "./configuration";

namespace Notifications {
	export function notifyAutoInstallSuccess(version: ReleaseVersion.T): void {
		const disableNotificationMessage = "Disable this notification";
		const message = `Lexical was automatically updated to version ${ReleaseVersion.serialize(version)}.`;
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
