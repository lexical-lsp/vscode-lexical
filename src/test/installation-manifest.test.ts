import { describe, expect, jest, test } from "@jest/globals";
import * as fs from "fs";
import InstallationManifest from "../installation-manifest";
import { Uri } from "vscode";
import * as semver from "semver";

jest.mock("fs");

const aVersion = new semver.SemVer("1.2.3");
const aDirectoryUri = Uri.parse("file:///vscode");

describe("write", () => {
	test("writes the serialized manifest to disk", () => {
		InstallationManifest.write(Uri.parse("file:///vscode"), {
			name: "",
			version: aVersion,
			archiveUrl: Uri.parse("http://example.com"),
		});

		expect(fs.writeFileSync).toHaveBeenCalledWith(
			"/vscode/installation_manifest.json",
			`{"installedVersion":"${aVersion.format()}"}`
		);
	});
});

describe("fetch", () => {
	test("returns undefined when installation manifest does not exist", () => {
		givenFileDoesNotExist();

		expect(InstallationManifest.fetch(aDirectoryUri)).toBeUndefined();
	});

	test("returns undefined when the stored manifest is invalid", () => {
		givenStoredManifest({});

		expect(InstallationManifest.fetch(aDirectoryUri)).toBeUndefined();
	});

	test("returns a manifest when the stored manifest is valid", () => {
		givenStoredManifest({ installedVersion: aVersion.format() });

		expect(InstallationManifest.fetch(aDirectoryUri)).toEqual({
			installedVersion: aVersion,
		});
	});
});

function givenFileDoesNotExist() {
	(fs.existsSync as jest.Mock).mockReturnValue(false);
}

function givenStoredManifest(manifest: Record<string, unknown>) {
	(fs.existsSync as jest.Mock).mockReturnValue(true);
	(fs.readFileSync as jest.Mock).mockReturnValue(
		Buffer.from(JSON.stringify(manifest), "utf-8")
	);
}
