import { LanguageClient } from "vscode-languageclient/node";
import Commands from ".";

interface Context {
	client: LanguageClient;
}

const restartServer: Commands.T<Context> = {
	id: "lexical.server.restart",
	createHandler: ({ client }) => {
		function handle() {
			if (client.isRunning()) {
				console.log("Lexical client is already running. Restarting.");
				client.restart();
			} else {
				console.log("Lexical client is not running. Starting.");
				client.start();
			}
		}

		return handle;
	},
};

export default restartServer;
