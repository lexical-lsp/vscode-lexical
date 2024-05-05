import { describe, expect, jest, test } from "@jest/globals";
import ClientCommands from "../../clientCommands";

describe("Commands", () => {
	describe("getRegisterFunction", () => {
		test("returns a function that registers the command with the client when called", () => {
			const clientRegister = jest.fn();
			const register = ClientCommands.getRegisterFunction(clientRegister);

			register(commandStub, undefined);

			expect(clientRegister).toHaveBeenCalledWith(commandStub.id, handler);
		});
	});
});

const handler = jest.fn();

const commandStub: ClientCommands.T<undefined> = {
	id: "stub",
	createHandler: () => handler,
};
