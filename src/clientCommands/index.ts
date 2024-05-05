namespace Commands {
	type CommandHandler = () => void;

	type RegisterFunction = <Context>(
		command: T<Context>,
		context: Context,
	) => void;

	export interface T<Context> {
		id: string;
		createHandler: (context: Context) => CommandHandler;
	}

	export function getRegisterFunction(
		clientRegister: (id: string, handler: CommandHandler) => void,
	): RegisterFunction {
		return <Context>(command: T<Context>, context: Context) =>
			clientRegister(command.id, command.createHandler(context));
	}
}

export default Commands;
