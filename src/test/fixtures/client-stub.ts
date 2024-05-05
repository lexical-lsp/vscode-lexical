import { jest } from "@jest/globals";
import { LanguageClient } from "vscode-languageclient/node";

interface Opts {
	sendRequest?: jest.Mock;
	isRunning?: boolean;
	restart?: jest.Mock;
	start?: jest.Mock;
}

export default function clientStub({
	sendRequest = jest.fn(),
	isRunning = true,
	restart = jest.fn(),
	start = jest.fn(),
}: Opts): LanguageClient {
	return {
		isRunning() {
			return isRunning;
		},
		sendRequest,
		start,
		restart,
	} as unknown as LanguageClient;
}
