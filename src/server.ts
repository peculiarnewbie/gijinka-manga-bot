import { Context, Env, Hono } from "hono";
import * as commands from "./lib/commands";
import {
	InteractionResponseType,
	InteractionType,
	verifyKey,
} from "discord-interactions";
import { BlankInput } from "hono/types";
import { Command } from "./types";

type Bindings = {
	DISCORD_PUBLIC_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => {
	return c.json({ message: "Hello World!" });
});

app.post("/", async (c) => {
	console.log("Received request");
	// Using the incoming headers, verify this request actually came from discord.
	const signature = c.req.header("x-signature-ed25519") ?? "";
	const timestamp = c.req.header("x-signature-timestamp") ?? "";
	const body = await c.req.arrayBuffer();
	console.log("signature", signature);
	let isValidRequest = false;
	try {
		isValidRequest = verifyKey(
			body,
			signature,
			timestamp,
			c.env.DISCORD_PUBLIC_KEY ?? ""
		);
		console.log("isValidRequest", isValidRequest);
	} catch (e) {
		console.error("Error verifying request", e);
		return new Response("Error verifying request", { status: 401 });
	}
	if (!isValidRequest) {
		console.error("Invalid Request");
		return new Response("Bad request signature.", { status: 401 });
	}

	return handler(c);
});

async function handler(
	c: Context<
		{
			Bindings: Bindings;
		},
		"/",
		BlankInput
	>
) {
	const message = await c.req.json();
	console.log("message", message);
	if (message.type === InteractionType.PING) {
		console.log("Handling Ping request");
		return c.json({
			type: InteractionResponseType.PONG,
		});
	}

	if (message.type === InteractionType.APPLICATION_COMMAND) {
		let command: Command | undefined = undefined;
		const allCommands = Object.values(commands);
		for (const c of allCommands) {
			if (c.name === message.data.name) {
				command = c;
				break;
			}
		}
		if (command) return c.json(await command.function());
	}

	console.error("Unknown Type");
	return c.json({ error: "Unknown Type" }, { status: 400 });
}

export default app;
