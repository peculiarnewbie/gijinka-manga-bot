const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

function htmlclean(escapedHTML) {
  return escapedHTML
    .replace(/<br>/g," ")
    .replace(/(<([^>]+)>)/gi, "")
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("4cthread")
    .setDescription("do your lurk reps")
    .addStringOption((option) =>
      option.setName("board").setDescription("which board").setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("limit")
        .setDescription("how many")
        .setMaxValue(10)
        .setMinValue(1)
    ),

  async execute(interaction) {
    const catalogArr = [];
    await interaction.deferReply();
    const boardParams = interaction.options.getString("board", true); // Required parameter
    const limitParams = interaction.options.getInteger("limit") || 1;
    const res = await axios({
      method: "GET",
      url: `https://a.4cdn.org/${boardParams}/catalog.json`,
    }).then((res) => {
      res.data.forEach((page) => {
        page.threads.forEach((item) => {
          const catalogObj = {
            thread: item.no,
            title: item.sub,
            body: item.com,
            reply: item.replies,
          };
          catalogArr.push(catalogObj);
        });
      });
      catalogArr.sort((a, b) => b.reply - a.reply);
      console.log("--- array sorted ---");
      return catalogArr;
    });

    const embed = new EmbedBuilder().setTitle(`Thread Liveness`).setTimestamp();
    const temp_res = [];
    for (let index = 0; index < limitParams; index++) {
      temp_res.push(res);
      if (!res[index].title) {
        if (!res[index].body) {
          embed.addFields({
            name: `${res[index].thread}`,
            value: `${res[index].reply} interactions \nhttps://boards.4chan.org/${boardParams}/thread/${res[index].thread}`,
          });
        } else {
          embed.addFields({
            name: `${htmlclean(res[index].body.substring(0, 400))} - ${res[index].thread}`,
            value: `${res[index].reply} interactions \nhttps://boards.4chan.org/${boardParams}/thread/${res[index].thread}`,
          });
        }
      } else {
        if (!res[index].body) {
          embed.addFields({
            name: `${res[index].title} - ${res[index].thread}`,
            value: `${res[index].reply} interactions \nhttps://boards.4chan.org/${boardParams}/thread/${res[index].thread}`,
          });
        } else {
          embed.addFields({
            name: `${res[index].title} - ${res[index].thread}`,
            value: `${htmlclean(res[index].body.substring(0, 400))}... \n${res[index].reply} interactions \nhttps://boards.4chan.org/${boardParams}/thread/${res[index].thread}`,
          });
        }
      }
    }
    await interaction.editReply({ embeds: [embed] });
  },
};
