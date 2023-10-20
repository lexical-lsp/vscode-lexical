/* eslint-disable @typescript-eslint/no-explicit-any */
import { jest } from "@jest/globals";

type AsyncFunction = (...args: any) => Promise<unknown>;
type Fun = (...args: any) => unknown;

// keyof returns the keys of the given object type, except for keys of type never
type KeyOfType<T, V> = keyof {
	// All keys P that do not match the type V will be replaced by never
	[P in keyof T as T[P] extends V ? P : never]: unknown;
};

type AwaitedReturnOfFunctionOfType<T, F extends keyof T> = Awaited<
	ReturnOfFunctionOfType<T, F>
>;
type ReturnOfFunctionOfType<T, F extends keyof T> = T[F] extends Fun
	? ReturnType<T[F]>
	: never;

function mockModuleFunction<M, F extends keyof M>(
	module: M,
	fun: F,
): jest.Mock<(...args: any) => any> {
	if (!jest.isMockFunction(module[fun])) {
		module[fun] = jest.fn() as M[F];
	}

	return module[fun] as jest.Mock;
}

/*
  The V type is necessary because while KeyOfType<M, AsyncFunction> asserts that
  F is a key of M, typescript isn't able to infer that it also matches AsyncFunction.

  Therefore, we need another conditional type (which we know will always be true)
  to remake that assertion and prevent typescript from complaining that we might
  be trying to get the return type of a non-function type
 */
export function mockResolvedValue<M, F extends KeyOfType<M, AsyncFunction>>(
	module: M,
	fun: F,
	value: AwaitedReturnOfFunctionOfType<M, F>,
): void {
	const mockedFunction = mockModuleFunction(module, fun);
	mockedFunction.mockResolvedValue(value);
}

export function mockRejectedValue<M>(
	module: M,
	fun: KeyOfType<M, AsyncFunction>,
	value: unknown,
): void {
	const mockedFunction = mockModuleFunction(module, fun);
	mockedFunction.mockRejectedValue(value);
}

export function mockReturnValue<M, F extends KeyOfType<M, Fun>>(
	module: M,
	fun: F,
	value: ReturnOfFunctionOfType<M, F>,
): void {
	const mockedFunction = mockModuleFunction(module, fun);
	mockedFunction.mockReturnValue(value);
}

export function mockKeys<T extends object>(obj: T): T {
	return Object.keys(obj).reduce((acc, cur) => {
		acc[cur as keyof T] = jest.fn() as any;
		return acc;
	}, {} as T);
}
