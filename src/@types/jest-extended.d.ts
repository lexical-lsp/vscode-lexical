import * as matchers from "jest-extended";
import { jest } from "@jest/globals";

type JestExtendedMatchers = typeof matchers;

declare module "@jest/expect" {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-unused-vars
	export interface Matchers<R> extends JestExtendedMatchers {
		toHaveBeenCalledBefore(
			mock: jest.MockedFunction<any>,
			failIfNoSecondInvocation?: boolean
		): void;
	}
}
