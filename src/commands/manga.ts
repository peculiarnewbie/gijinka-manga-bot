import { InteractionResponseType } from "discord-interactions";
import { Command } from "../types";

const manga: Command = {
	name: "manga",
	description: "ew wibu",
	function: async () => {
		const chapter = 11;

		const resp = await fetch(
			"https://api.mangadex.org/manga/acdbf57f-bf54-41b4-8d92-b3f3d14c852e/"
		);
		const manga = newManga(await resp.json());
		return manga;
	},
};

export default manga;

class Manga {
	Title: string;
	Link: string;
	LatestChapter: string;
	Volumes: string;
	constructor(
		Title: string,
		Link: string,
		LatestChapter: string,
		Volumes: string
	) {
		this.Title = Title;
		this.Link = Link;
		this.LatestChapter = LatestChapter;
		this.Volumes = Volumes;
	}
}

//@ts-expect-error
const newManga = (input) => {
	let Title = input.data.attributes["title"]["en"];
	let Link = input.Link;
	let LatestChapter = ` https://mangadex.org/chapter/${input.data.attributes["latestUploadedChapter"]}`;
	// const Volumes = Object.keys(input.volumes).map(item => input.volumes[item]) //todo using newVolumes
	let Volumes = input.data.attributes["lastVolume"];
	let newManga = new Manga(Title, Link, LatestChapter, Volumes);

	console.log("newManga");
	console.log(newManga);
	return newManga;
};
