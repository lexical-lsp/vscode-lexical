import { OutputChannel, l10n, window } from "vscode";

namespace Logger {
	type ArgsDictionary = Record<string, number | boolean | string>;

	const channel = window.createOutputChannel("Lexical", { log: true });

	export function trace(message: string, args: ArgsDictionary = {}): void {
		const localizedMessage = l10n.t(message, args);
		channel.debug(localizedMessage);
		console.debug(localizedMessage);
	}

	export function debug(
		message: string,
		args: Record<string, number | boolean | string> = {},
	): void {
		const localizedMessage = l10n.t(message, args);
		channel.debug(localizedMessage);
		console.debug(localizedMessage);
	}

	export function info(
		message: string,
		args: Record<string, number | boolean | string> = {},
	): void {
		const localizedMessage = l10n.t(message, args);
		channel.info(localizedMessage);
		console.log(localizedMessage);
	}

	export function warn(
		message: string,
		args: Record<string, number | boolean | string> = {},
	): void {
		const localizedMessage = l10n.t(message, args);
		channel.warn(localizedMessage);
		console.warn(localizedMessage);
	}

	export function error(
		message: string,
		args: Record<string, number | boolean | string> = {},
	): void {
		const localizedMessage = l10n.t(message, args);
		channel.error(localizedMessage);
		console.error(localizedMessage);
	}

	export function outputChannel(): OutputChannel {
		return channel;
	}
}

export default Logger;
