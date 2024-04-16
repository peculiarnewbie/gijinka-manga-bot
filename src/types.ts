export type Command = {
	name: string;
	description: string;
	function: () => Promise<any>;
};
