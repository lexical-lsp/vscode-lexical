import { Progress } from "vscode";
import { URI } from "vscode-uri";

function joinPath(base: URI, ...pathSegments: string[]): URI {
	return base.with({ path: [base.path, ...pathSegments].join("/") });
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Uri = { parse: URI.parse, joinPath, file: URI.file };

const progressStub = {
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	report: () => {},
};

type WithProgressFun = (
	progress: Progress<{
		message: string;
	}>,
) => Promise<void>;

export const window = {
	withProgress: (_: unknown, fun: WithProgressFun) => fun(progressStub),
};

export enum ProgressLocation {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	SourceControl,
	// eslint-disable-next-line @typescript-eslint/naming-convention
	Window,
	// eslint-disable-next-line @typescript-eslint/naming-convention
	Notification,
}
