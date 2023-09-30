import { URI } from "vscode-uri";

function joinPath(base: URI, ...pathSegments: string[]): URI {
	return base.with({ path: [base.path, ...pathSegments].join("/") });
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Uri = { parse: URI.parse, joinPath, file: URI.file };
