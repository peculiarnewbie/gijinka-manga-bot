import { CommandData } from "../types";
import * as commands from "./commands";

const token = process.env.DISCORD_TOKEN;
const applicationId = process.env.DISCORD_APPLICATION_ID;

if (!token) {
	throw new Error("The DISCORD_TOKEN environment variable is required.");
}
if (!applicationId) {
	throw new Error(
		"The DISCORD_APPLICATION_ID environment variable is required."
	);
}

const allCommands: CommandData[] = Object.values(commands).map((command) => ({
	name: command.name,
	description: command.description,
}));

await registerGlobalCommands();

async function registerGlobalCommands() {
	const url = `https://discord.com/api/v10/applications/${applicationId}/commands`;
	await registerCommands(url);
}

async function registerCommands(url: string) {
	const response = await fetch(url, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bot ${token}`,
		},
		method: "PUT",
		body: JSON.stringify(allCommands),
	});

	if (response.ok) {
		console.log("Registered all commands");
	} else {
		console.error("Error registering commands");
		const text = await response.text();
		console.error(text);
	}
	return response;
}
