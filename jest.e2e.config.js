// see https://github.com/microsoft/vscode-test/issues/37#issuecomment-700167820
const path = require("path");

module.exports = {
	moduleFileExtensions: ["js"],
	testMatch: ["<rootDir>/out/test-e2e/suite/**.test.js"],
	testEnvironment: "./src/test-e2e/vscode-environment.js",
	verbose: true,
	moduleNameMapper: {
		vscode: path.join(__dirname, "src", "test-e2e", "vscode.js"),
	},
};
