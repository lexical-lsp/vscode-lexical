import { describe, expect, jest, test } from "@jest/globals";
import { LanguageClient } from "vscode-languageclient/node";
import restartServer from "../../clientCommands/restart-server";
import clientStub from "../fixtures/client-stub";

describe("restartServer", () => {
	test("given it is running, restarts it", () => {
		const restart = jest.fn<LanguageClient["restart"]>();
		const handler = restartServer.createHandler({
			client: clientStub({ isRunning: true, restart }),
		});

		handler();

		expect(restart).toHaveBeenCalled();
	});

	test("given the client is not running, starts it", () => {
		const start = jest.fn<LanguageClient["restart"]>();
		const handler = restartServer.createHandler({
			client: clientStub({ isRunning: false, start }),
		});

		handler();

		expect(start).toHaveBeenCalled();
	});
});
