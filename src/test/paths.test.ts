import { test, describe, expect } from "@jest/globals";
import { URI } from "vscode-uri";
import Paths from "../paths";
import ReleaseVersionFixture from "./fixtures/release-version-fixture";

describe("Paths", () => {
	test("getInstallationDirectory returns the appropriate uri", () => {
		const globalStorageUri = URI.parse("/vscode");
		const installationDirectory =
			Paths.getInstallationDirectoryUri(globalStorageUri);

		expect(installationDirectory).toEqual(URI.parse("/vscode/lexical_install"));
	});

	test("getZipUri returns the appropriate uri", () => {
		const globalStorageUri = URI.parse("/vscode");
		const zipUri = Paths.getZipUri(globalStorageUri);

		expect(zipUri).toEqual(URI.parse("/vscode/lexical_install/lexical.zip"));
	});

	test("getReleaseUri returns the appropriate uri", () => {
		const globalStorageUri = URI.parse("/vscode");
		const releaseUri = Paths.getReleaseUri(globalStorageUri);

		expect(releaseUri).toEqual(URI.parse("/vscode/lexical_install/lexical"));
	});

	describe("getStartScriptUri", () => {
		test("returns script from bin when release uses new packaging", () => {
			const releaseUri = URI.parse("/lexical");
			const version = ReleaseVersionFixture.thatUsesNewPackaging();
			const startScriptUri = Paths.getStartScriptUri(releaseUri, version);

			expect(startScriptUri).toEqual(
				URI.parse("/lexical/bin/start_lexical.sh")
			);
		});
	});
});
