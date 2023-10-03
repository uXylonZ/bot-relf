const Discord = require("discord.js")
const config = require("./config.json")
const fs = require('fs')

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.GuildMembers, Discord.GatewayIntentBits.GuildPresences,
        Discord.GatewayIntentBits.MessageContent, Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.MessageContent, Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildMessageReactions
    ]
})

module.exports = client

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.execute(client, interaction);
    } catch (error) {
        let erro = new Discord.EmbedBuilder()
            .setDescription(`Não foi possível executar este comando, por favor contacte o meu criador! \`uVape#9688\``)
            .setColor(`DarkRed`);
        console.error(error);
        await interaction.reply({ embeds: [erro], ephemeral: true });
    }
});

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token } = require('./config.json');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const clientId = "1154703887081689088";

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
    try {
        console.log(`\n\nCarregando os comandos do bot...`);
        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );
        console.log(`\nForam carregados `.green + `${commandFiles.length}`.white + ` comandos`.green);
    } catch (error) {
        console.error(error);
    }
})();

const { Collection, Intents } = require('discord.js');

client.commands = new Collection();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    client.on(event.name, (...args) => event.execute(...args, client));
};

process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception: " + err);
});
process.on("unhandledRejection", (reason, promise) => {
    console.log("\n\n\n\n[ERRO GRAVE] Houve um erro, aqui os detalhes:\n\n", promise, "\n\nMotivo do erro: ", reason.message);
});

client.login(config.token)

