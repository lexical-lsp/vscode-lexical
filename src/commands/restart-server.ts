import { LanguageClient } from "vscode-languageclient/node";
import Commands from ".";

interface Context {
	client: LanguageClient;
	showWarning: (message: string) => void;
}

const restartServer: Commands.T<Context> = {
	id: "lexical.server.restart",
	createHandler: ({ client, showWarning }) => {
		function handle() {
			if (client.isRunning()) {
				client.restart();
			} else {
				showWarning("Server is not running, cannot restart.");
			}
		}

		return handle;
	},
};

export default restartServer;
