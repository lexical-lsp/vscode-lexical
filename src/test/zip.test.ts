import { test, describe, expect, jest } from "@jest/globals";
import Zip from "../zip";
import { URI } from "vscode-uri";
import ReleaseVersionFixture from "./fixtures/release-version-fixture";
import * as fs from "fs";
import extract = require("extract-zip");

jest.mock("extract-zip");
jest.mock("fs");

describe("extract", () => {
	test("clears the release directory before extracting", () => {
		const releaseUri = URI.parse("/release");
		Zip.extract(URI.parse("/zip"), releaseUri, ReleaseVersionFixture.any());

		expect(fs.rmSync).toHaveBeenCalledWith(releaseUri.fsPath, {
			recursive: true,
			force: true,
		});
		expect(fs.rmSync).toHaveBeenCalledBefore(extract);
	});

	test("given a release version that uses new packaging, extracts the zip to the parent of the release URI", () => {
		const releaseUri = URI.parse("/release");
		const releaseParentUri = URI.parse("/release/..");
		const zipUri = URI.parse("/zip");
		Zip.extract(
			zipUri,
			releaseUri,
			ReleaseVersionFixture.thatUsesNewPackaging(),
		);

		expect(extract).toHaveBeenCalledWith(zipUri.fsPath, {
			dir: releaseParentUri.fsPath,
		});
	});

	test("given a release version that does not use new packaging, extracts the zip to the release URI", () => {
		const releaseUri = URI.parse("/release");
		const zipUri = URI.parse("/zip");
		Zip.extract(
			zipUri,
			releaseUri,
			ReleaseVersionFixture.thatDoesNotUseNewPackaging(),
		);

		expect(extract).toHaveBeenCalledWith(zipUri.fsPath, {
			dir: releaseUri.fsPath,
		});
	});

	test("given a release version that uses new packaging, adds execute permissions to the relevant files", async () => {
		const releaseUri = URI.parse("/release");
		await Zip.extract(
			URI.parse("/zip"),
			releaseUri,
			ReleaseVersionFixture.thatUsesNewPackaging(),
		);

		expectExecutePermissionWasAdded(
			releaseUri.fsPath + "/bin/start_lexical.sh",
		);
		expectExecutePermissionWasAdded(releaseUri.fsPath + "/bin/debug_shell.sh");
		expectExecutePermissionWasAdded(
			releaseUri.fsPath + "/priv/port_wrapper.sh",
		);
	});

	test("given zip extraction fails, throws the error", () => {
		const anError = new Error("something went wrong");
		asMocked(extract).mockRejectedValue(anError);

		expect(() =>
			Zip.extract(
				URI.parse("/zip"),
				URI.parse("/release"),
				ReleaseVersionFixture.thatUsesNewPackaging(),
			),
		).rejects.toThrowError(anError);
	});

	test("given a release version that uses new packaging and adding execute permissions fails, throws the error", () => {
		const anError = new Error("something went wrong");
		asMocked(fs.chmodSync).mockImplementation(() => {
			throw anError;
		});

		expect(() =>
			Zip.extract(
				URI.parse("/zip"),
				URI.parse("/release"),
				ReleaseVersionFixture.thatUsesNewPackaging(),
			),
		).rejects.toThrowError(anError);
	});
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function asMocked<F extends (...args: any[]) => unknown>(
	fun: F,
): jest.MockedFunction<F> {
	return fun as jest.MockedFunction<F>;
}

function expectExecutePermissionWasAdded(filePath: string): void {
	expect(fs.chmodSync).toHaveBeenCalledWith(filePath, 0o755);
}
