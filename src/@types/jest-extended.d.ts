import { jest } from "@jest/globals";
import * as matchers from "jest-extended";

type JestExtendedMatchers = typeof matchers;

declare module "@jest/expect" {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-unused-vars
	export interface Matchers<R> extends JestExtendedMatchers {}
}
