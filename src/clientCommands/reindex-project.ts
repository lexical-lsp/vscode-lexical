import Commands from ".";
import Logger from "../logger";
import { LanguageClient } from "vscode-languageclient/node";
import ServerCommands from "../serverCommands/server-commands";

interface Context {
	client: LanguageClient;
}

const reindexProject: Commands.T<Context> = {
	id: "lexical.server.reindexProject",
	createHandler: ({ client }) => {
		function handle() {
			if (!client.isRunning()) {
				Logger.error("Client is not running, cannot send command to server.");
				return;
			}

			ServerCommands.reindex(client);
		}

		return handle;
	},
};

export default reindexProject;
