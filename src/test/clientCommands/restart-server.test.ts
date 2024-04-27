import { describe, expect, jest, test } from "@jest/globals";
import { LanguageClient } from "vscode-languageclient/node";
import restartServer from "../../clientCommands/restart-server";

describe("restartServer", () => {
	test("given it is running, restarts it", () => {
		const restart = jest.fn<LanguageClient["restart"]>();
		const handler = restartServer.createHandler({
			client: getClientStub({ isRunning: true, restart }),
		});

		handler();

		expect(restart).toHaveBeenCalled();
	});

	test("given the client is not running, starts it", () => {
		const start = jest.fn<LanguageClient["restart"]>();
		const handler = restartServer.createHandler({
			client: getClientStub({ isRunning: false, start }),
		});

		handler();

		expect(start).toHaveBeenCalled();
	});
});

function getClientStub({
	isRunning,
	restart = jest.fn<LanguageClient["restart"]>(),
	start = jest.fn<LanguageClient["start"]>(),
}: {
	isRunning: boolean;
	restart?: LanguageClient["restart"];
	start?: LanguageClient["start"];
}): LanguageClient {
	return {
		isRunning() {
			return isRunning;
		},
		restart,
		start,
	} as unknown as LanguageClient;
}
