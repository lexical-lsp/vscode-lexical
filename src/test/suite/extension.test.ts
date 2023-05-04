import * as vscode from "vscode";
import * as assert from "assert";
import { activate, Fixture } from "../helpers";

suite("Should get diagnostics", () => {
	test("Diagnoses uppercase texts", async () => {
		await testDiagnostics(Fixture.diagnostics, [
			{
				message:
					"** (CompileError) lib/diagnostics.ex:3: undefined function foo/0 (expected Fixtures to define such a function or for it to be imported, but none are available)\n\n",
				range: toRange(2, 0, 3, 0),
				severity: vscode.DiagnosticSeverity.Error,
				source: "Elixir",
			},
		]);
	});
});

function toRange(sLine: number, sChar: number, eLine: number, eChar: number) {
	const start = new vscode.Position(sLine, sChar);
	const end = new vscode.Position(eLine, eChar);
	return new vscode.Range(start, end);
}

async function testDiagnostics(
	fixture: Fixture,
	expectedDiagnostics: vscode.Diagnostic[]
) {
	const [doc] = await activate(fixture);

	const actualDiagnostics = vscode.languages.getDiagnostics(doc.uri);

	assert.equal(actualDiagnostics.length, expectedDiagnostics.length);

	expectedDiagnostics.forEach((expectedDiagnostic, i) => {
		const actualDiagnostic = actualDiagnostics[i];
		assert.equal(actualDiagnostic.message, expectedDiagnostic.message);
		assert.deepEqual(actualDiagnostic.range, expectedDiagnostic.range);
		assert.equal(actualDiagnostic.severity, expectedDiagnostic.severity);
	});
}
