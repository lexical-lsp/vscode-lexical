import {
	ExecuteCommandRequest,
	LanguageClient,
} from "vscode-languageclient/node";

const REINDEX_COMMAND_NAME = "Reindex";

namespace ServerCommands {
	export async function reindex(client: LanguageClient): Promise<void> {
		await client.sendRequest(ExecuteCommandRequest.type, {
			command: REINDEX_COMMAND_NAME,
			arguments: [],
		});
	}
}

export default ServerCommands;
