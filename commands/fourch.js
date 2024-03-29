const { SlashCommandBuilder } = require("discord.js");
const { getCatalog } = require("../test/test_4c.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("4cthread")
    .setDescription("do your lurk reps")
    .addStringOption((option) =>
      option.setName("board").setDescription("which board").setRequired(true)
    )
    .addIntegerOption((option) =>
      option.setName("limit").setDescription("how many").setMaxValue(5)
    ),

  async execute(interaction) {
    const catalogArr = [];
    // await interaction.deferReply();
    const boardParams = interaction.options.getString("board", true); // Required parameter
    const limitParams = interaction.options.getInteger("limit");
    const res = await axios({
      method: "GET",
      url: `https://a.4cdn.org/${boardParams}/catalog.json`,
    }).then((res) => {
      res.data.forEach((page) => {
        page.threads.forEach((item) => {
          const catalogObj = {
            thread: item.no,
            title: item.sub,
            reply: item.replies,
          };
          catalogArr.push(catalogObj);
        });
      });
      catalogArr.sort((a, b) => b.reply - a.reply);
      console.log("array sorted");
      return catalogArr;
    });

    // const temp_res = [];
    // for (let index = 0; index < limitParams; index++) {
    //   temp_res.push(res);
    // }
	await interaction.reply(`${res[0].title} \n${res[0].reply} times`);
  }
};
