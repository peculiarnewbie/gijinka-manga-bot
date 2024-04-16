export type Command = CommandData & {
	function: () => Promise<any>;
};

export type CommandData = {
	name: string;
	description: string;
};
