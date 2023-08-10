const { SlashCommandBuilder } = require("discord.js");
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("crawler")
		.setDescription("kamu itu [isi sendiri]")
		.addStringOption(
			option => option.setName("url").setDescription("URL for crawling").setRequired(true)
		).addStringOption(
			option => option.setName("class_list").setDescription("tag class to crawl / get")
		).addStringOption(
			option => option.setName("search_word").setDescription("word_to_find")
		),

	async execute(interaction) {
		await interaction.deferReply();
		const endpoint = "http://api.pdlanet.com/crawler";
		const url_params = interaction.options.getString("url", true); // Required parameter
		const class_params = interaction.options.getString("class_list");
		const search_index = interaction.options.getString("search_word");
		const resp = await axios.get(endpoint, {
			params: { url: url_params, class_list: class_params },
		});
		const link = endpoint + "/?url=" + url_params + "&class_list=" + class_params;
		const crawl_result = String(resp.data);
		if (crawl_result.length > 2000) {
			await interaction.editReply({ content: `linknya gan ${link}` });
		}
		else {
			crawl_result = crawl_result.split("\n");

			crawl_result.forEach(async function myFunction(item, index) {
				if (item.search(search_index) != -1) {
					await interaction.editReply({ content: item });
				}
			});
		}
	}
}