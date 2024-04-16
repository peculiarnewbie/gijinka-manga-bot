import { InteractionResponseType } from "discord-interactions";
import { Command } from "../types";

const manga: Command = {
	name: "manga",
	description: "ew wibu",
	function: async (c) => {
		const chapter = 11;

		const resp = await fetch(
			"https://api.mangadex.org/manga/acdbf57f-bf54-41b4-8d92-b3f3d14c852e/",
			{
				headers: {
					"User-Agent":
						c?.req.header("User-Agent") ??
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
				},
			}
		);

		let manga;
		const text = await resp.text();
		try {
			manga = newManga(JSON.parse(text));
		} catch (e) {
			console.error(e);
		}

		return {
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: {
				content: JSON.stringify(manga),
			},
		};
	},
};

export default manga;

type Manga = {
	title: string;
	link: string;
	latestChapter: string;
	volumes: string;
};

const newManga = (input: any) => {
	let newManga: Manga = {
		title: input.data.attributes.title.en,
		link: `https://mangadex.org/manga/${input.data.id}`,
		latestChapter: `https://mangadex.org/chapter/${input.data.attributes.latestUploadedChapter}`,
		volumes: input.data.attributes.lastVolume,
	};
	return newManga;
};
