import { describe, expect, test } from "@jest/globals";
import reindexProject from "../../clientCommands/reindex-project";
import ServerCommands from "../../serverCommands/server-commands";
import clientStub from "../fixtures/client-stub";
import { mockResolvedValue } from "../utils/strict-mocks";

describe("reindexProject", () => {
	test("should call the 'Reindex' server command", () => {
		const handler = reindexProject.createHandler({
			client: clientStub({ isRunning: true }),
		});
		mockResolvedValue(ServerCommands, "reindex");

		handler();

		expect(ServerCommands.reindex).toHaveBeenCalled();
	});

	test("given client is not running, it should do nothing", () => {
		const handler = reindexProject.createHandler({
			client: clientStub({ isRunning: false }),
		});
		mockResolvedValue(ServerCommands, "reindex");

		handler();

		expect(ServerCommands.reindex).not.toHaveBeenCalled();
	});
});
