import { LanguageClient } from "vscode-languageclient/node";
import ClientCommands from ".";
import Logger from "../logger";

interface Context {
	client: LanguageClient;
}

const restartServer: ClientCommands.T<Context> = {
	id: "lexical.server.restart",
	createHandler: ({ client }) => {
		function handle() {
			if (client.isRunning()) {
				Logger.info("Lexical client is already running. Restarting.");
				client.restart();
			} else {
				Logger.info("Lexical client is not running. Starting.");
				client.start();
			}
		}

		return handle;
	},
};

export default restartServer;
