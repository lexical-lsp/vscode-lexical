// see https://github.com/microsoft/vscode-test/issues/37#issuecomment-700167820
const path = require("path");

module.exports = {
	moduleFileExtensions: ["js"],
	testMatch: ["<rootDir>/out/test/suite/**.test.js"],
	testEnvironment: "./src/test/vscode-environment.js",
	verbose: true,
	moduleNameMapper: {
		vscode: path.join(__dirname, "src", "test", "vscode.js"),
	},
};
