import { InteractionResponseType } from "discord-interactions";
import { Command } from "../types";

const lucu: Command = {
	name: "lucu",
	description: "ketawa",
	function: async () => {
		console.log("handling lucu request");
		return {
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: {
				content: "sePong",
			},
		};
	},
};

export default lucu;
