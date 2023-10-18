import { describe, expect, jest, test } from "@jest/globals";
import restartServer from "../../commands/restart-server";
import { LanguageClient } from "vscode-languageclient/node";

describe("restartServer", () => {
	test("restarts the language client", () => {
		const restart = jest.fn<LanguageClient["restart"]>();
		const handler = restartServer.createHandler({
			client: getClientStub(true, restart),
			showWarning: jest.fn(),
		});

		handler();

		expect(restart).toHaveBeenCalled();
	});

	test("given the client is not running, shows a warning", () => {
		const showWarning = jest.fn();
		const handler = restartServer.createHandler({
			client: getClientStub(false, jest.fn<LanguageClient["restart"]>()),
			showWarning: showWarning,
		});

		handler();

		expect(showWarning).toHaveBeenCalled();
	});
});

function getClientStub(
	isRunning: boolean,
	restart: LanguageClient["restart"],
): LanguageClient {
	return {
		isRunning() {
			return isRunning;
		},
		restart,
	} as unknown as LanguageClient;
}
