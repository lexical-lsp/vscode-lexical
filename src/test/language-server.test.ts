import { describe, expect, jest, test } from "@jest/globals";
import LanguageServer from "../language-server";
import Github from "../github";
import { URI } from "vscode-uri";
import {
	mockRejectedValue,
	mockResolvedValue,
	mockReturnValue,
} from "./utils/strict-mocks";
import ReleaseFixture from "./fixtures/release-fixture";
import Paths from "../paths";
import AutoInstaller from "../auto-installer";
import InstallationManifest from "../installation-manifest";
import Release from "../release";
import ReleaseVersionFixture from "./fixtures/release-version-fixture";
import ReleaseVersion from "../release/version";

jest.mock("../github");
jest.mock("../paths");
jest.mock("../auto-installer");
jest.mock("../installation-manifest");

describe("LanguageServer", () => {
	describe("install", () => {
		test("fetches the latest release from github", async () => {
			givenInstallationDirUri();
			givenReleaseUri();
			givenStartScriptUri();
			givenLatestRelease();
			givenInstalledReleaseIsLatest();

			await LanguageServer.install(globalStorageUri, showError);

			expect(Github.fetchLatestRelease).toHaveBeenCalled();
		});

		test("should not install lexical if installed release is latest", async () => {
			givenInstallationDirUri();
			givenReleaseUri();
			givenStartScriptUri();
			givenLatestRelease();
			givenInstalledReleaseIsLatest();

			await LanguageServer.install(globalStorageUri, showError);

			expect(AutoInstaller.install).not.toHaveBeenCalled();
		});

		test("should return start script path if installed release is latest", async () => {
			givenInstallationDirUri();
			givenReleaseUri();
			const startScriptUri = givenStartScriptUri();
			givenLatestRelease();
			givenInstalledReleaseIsLatest();

			const startScriptPath = await LanguageServer.install(
				globalStorageUri,
				showError,
			);

			expect(startScriptPath).toEqual(startScriptUri.fsPath);
		});

		test("should install lexical", async () => {
			givenInstallationDirUri();
			const releaseUri = givenReleaseUri();
			givenStartScriptUri();
			const latestRelease = givenLatestRelease();
			givenInstalledReleaseIsNotLatest();

			await LanguageServer.install(globalStorageUri, showError);

			expect(AutoInstaller.install).toHaveBeenCalledWith(
				expect.anything(),
				latestRelease,
				releaseUri,
			);
		});

		test("should write installation manifest", async () => {
			const installationDirUri = givenInstallationDirUri();
			givenReleaseUri();
			givenStartScriptUri();
			const latestRelease = givenLatestRelease();
			givenInstalledReleaseIsNotLatest();

			await LanguageServer.install(globalStorageUri, showError);

			expect(InstallationManifest.write).toHaveBeenCalledWith(
				installationDirUri,
				latestRelease,
			);
		});

		test("should return the start script path", async () => {
			givenReleaseUri();
			const startScriptUri = givenStartScriptUri();
			givenInstalledReleaseIsNotLatest();

			const startScriptPath = await LanguageServer.install(
				globalStorageUri,
				showError,
			);

			expect(startScriptPath).toEqual(startScriptUri.fsPath);
		});

		test("when installating a new version fails and another version is already installed, it should return the path for the already installed server", async () => {
			givenInstallationDirUri();
			givenLatestRelease();
			const startScriptUri = givenStartScriptUri();
			givenInstalledReleaseIsNotLatest();
			givenInstallingLatestReleaseFails();
			givenInstalledVersion(ReleaseVersionFixture.any());

			const startScriptPath = await LanguageServer.install(
				globalStorageUri,
				showError,
			);

			expect(startScriptPath).toEqual(startScriptUri.fsPath);
		});

		test("when installating a new version fails and no other version is already installed, it should return undefined", async () => {
			givenInstallationDirUri();
			givenLatestRelease();
			givenInstalledReleaseIsNotLatest();
			givenInstallingLatestReleaseFails();
			givenInstalledVersion(undefined);

			const startScriptPath = await LanguageServer.install(
				globalStorageUri,
				showError,
			);

			expect(startScriptPath).toBeUndefined();
		});

		test("when fetching the latest release fails and another version is already installed, it should return the path for the already installed server", async () => {
			givenInstallationDirUri();
			givenFetchingLatestReleaseFails();
			const startScriptUri = givenStartScriptUri();
			givenInstalledVersion(ReleaseVersionFixture.any());

			const startScriptPath = await LanguageServer.install(
				globalStorageUri,
				showError,
			);

			expect(startScriptPath).toEqual(startScriptUri.fsPath);
		});

		test("when fetching the latest release fails and no other version is already installed, it should return undefined", async () => {
			givenInstallationDirUri();
			givenFetchingLatestReleaseFails();
			givenInstalledVersion(undefined);

			const startScriptPath = await LanguageServer.install(
				globalStorageUri,
				showError,
			);

			expect(startScriptPath).toBeUndefined();
		});
	});
});

const globalStorageUri = URI.parse("file://tmp.txt");
const showError = jest.fn();

function givenInstalledReleaseIsLatest(): void {
	mockReturnValue(AutoInstaller, "isInstalledReleaseLatest", true);
}

function givenInstalledReleaseIsNotLatest(): void {
	mockReturnValue(AutoInstaller, "isInstalledReleaseLatest", false);
}

function givenLatestRelease(): Release.T {
	const latestRelease = ReleaseFixture.create();
	mockResolvedValue(Github, "fetchLatestRelease", latestRelease);
	return latestRelease;
}

function givenFetchingLatestReleaseFails(): void {
	mockRejectedValue(Github, "fetchLatestRelease", new Error());
}

function givenStartScriptUri(): URI {
	const startScriptUri = URI.parse("file://start-lexical.sh");
	mockReturnValue(Paths, "getStartScriptUri", startScriptUri);
	return startScriptUri;
}

function givenReleaseUri(): URI {
	const releaseUri = URI.parse("file://release");
	mockReturnValue(Paths, "getReleaseUri", releaseUri);
	return releaseUri;
}

function givenInstallationDirUri(): URI {
	const installationDirUri = URI.parse("file://install");
	mockReturnValue(Paths, "getInstallationDirectoryUri", installationDirUri);
	return installationDirUri;
}

function givenInstallingLatestReleaseFails(): void {
	mockRejectedValue(AutoInstaller, "install", new Error());
}

function givenInstalledVersion(version: ReleaseVersion.T | undefined): void {
	mockReturnValue(
		InstallationManifest,
		"fetch",
		version && { installedVersion: version },
	);
}
