import type { Config } from "jest";

const config: Config = {
	preset: "ts-jest",
	clearMocks: true,
	injectGlobals: false,
	maxWorkers: "50%",
	showSeed: true,
	testMatch: ["<rootDir>/src/test/**/*.test.ts"],
	setupFilesAfterEnv: ["./testSetup.ts"],
};

export default config;
