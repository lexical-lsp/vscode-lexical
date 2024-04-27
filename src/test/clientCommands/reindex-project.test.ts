import { describe, expect, jest, test } from "@jest/globals";
import { LanguageClient } from "vscode-languageclient/node";
import reindexProject from "../../clientCommands/reindex-project";

describe("reindexProject", () => {
	test("t", () => {
		const handler = reindexProject.createHandler({
			client: getClientStub({ isRunning: false }),
		});

		handler();
	});
});

function getClientStub({ isRunning }: { isRunning: boolean }): LanguageClient {
	return {
		isRunning() {
			return isRunning;
		},
		sendRequest: jest.fn(),
	} as unknown as LanguageClient;
}
