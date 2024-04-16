import { Context } from "hono";

export type Command = CommandData & {
	function: (c?: Context<any, any, any>) => Promise<any>;
};

export type CommandData = {
	name: string;
	description: string;
};
