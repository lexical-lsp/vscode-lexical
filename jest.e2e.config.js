const path = require("path");

module.exports = {
	moduleFileExtensions: ["js"],
	clearMocks: true,
	injectGlobals: false,
	showSeed: true,
	testMatch: ["<rootDir>/out/test-e2e/suite/**.test.js"],
	testEnvironment: "./src/test-e2e/vscode-environment.js",
	moduleNameMapper: {
		vscode: path.join(__dirname, "src", "test-e2e", "vscode.js"),
	},
};
