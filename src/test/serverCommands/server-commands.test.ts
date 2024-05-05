import { describe, expect, jest, test } from "@jest/globals";
import {
	ExecuteCommandRequest,
	LanguageClient,
} from "vscode-languageclient/node";
import ServerCommands from "../../serverCommands/server-commands";

describe("reindex", () => {
	test("it should send a request to the server with the 'Reindex' command", () => {
		const sendRequest = jest.fn();
		const client = getClientStub({ sendRequest });

		ServerCommands.reindex(client);

		expect(sendRequest).toHaveBeenCalledWith(ExecuteCommandRequest.type, {
			command: "Reindex",
			arguments: [],
		});
	});
});

function getClientStub({
	sendRequest,
}: {
	sendRequest: jest.Mock;
}): LanguageClient {
	return {
		sendRequest: sendRequest,
	} as unknown as LanguageClient;
}
