const {REST, Routes, Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
let axios = require('axios');
let dotenv = require('dotenv')

var TOKEN= process.env.TOKEN
var appID= process.env.APP_ID

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'lucu') {
    await interaction.reply('sePong!');
  }

  if (interaction.commandName === 'ping') {
    let chapter = 11;
    axios.get('https://api.mangadex.org/manga/acdbf57f-bf54-41b4-8d92-b3f3d14c852e/aggregate').then(resp => {

        interaction.reply({content: `${resp.data.volumes["1"].chapters["1"].chapter}`});
    });
  };
});

client.login(TOKEN);

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
  {
    name: 'lucu',
    description: 'Ketawa',
  },
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(String(appID)), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }

})();