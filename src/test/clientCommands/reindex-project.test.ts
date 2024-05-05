import { describe, expect, test } from "@jest/globals";
import { LanguageClient } from "vscode-languageclient/node";
import reindexProject from "../../clientCommands/reindex-project";
import { mockResolvedValue } from "../utils/strict-mocks";
import ServerCommands from "../../serverCommands/server-commands";

describe("reindexProject", () => {
	test("should call the 'Reindex' server command", () => {
		const handler = reindexProject.createHandler({
			client: getClientStub({ isRunning: true }),
		});
		mockResolvedValue(ServerCommands, "reindex", undefined);

		handler();

		expect(ServerCommands.reindex).toHaveBeenCalled();
	});

	test("given client is not running, it should do nothing", () => {
		const handler = reindexProject.createHandler({
			client: getClientStub({ isRunning: false }),
		});
		mockResolvedValue(ServerCommands, "reindex", undefined);

		handler();

		expect(ServerCommands.reindex).not.toHaveBeenCalled();
	});
});

function getClientStub({ isRunning }: { isRunning: boolean }): LanguageClient {
	return {
		isRunning() {
			return isRunning;
		},
	} as unknown as LanguageClient;
}
