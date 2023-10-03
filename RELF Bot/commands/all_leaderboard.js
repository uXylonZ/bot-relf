const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('[ Geral ] Vê as top 10 pessoas com o level mais alto.'),

    async execute(client, interaction) {

        db.all().then(allEntries => {
            const levelEntries = [];

            allEntries.forEach(entry => {
                const { id, value } = entry;
                if (id.startsWith('level_')) {
                    const userID = id.replace('level_', '');
                    const level = value;
                    levelEntries.push({ userID, level });
                }
            });

            // Ordenar o array com base no nível em ordem decrescente
            levelEntries.sort((a, b) => b.level - a.level);

            const userCount = levelEntries.length;
            if (userCount > 0) {
                const embed = new Discord.EmbedBuilder()
                    .setTitle("Leaderboard - Top 10")
                    .setColor("Yellow")

                for (let i = 0; i < userCount; i++) {
                    const entry = levelEntries[i];
                    const rank = i + 1;
                    embed.addFields({
                        name: `${rank}º Lugar`,
                        value: `<@${entry.userID}> no level: **${entry.level}**.`,
                        inline: false
                    })
                }
                interaction.reply({ embeds: [embed] })
            } else {
                const embed1 = new Discord.EmbedBuilder()
                    .setTitle("Leaderboard - Top 10")
                    .setDescription("Não tem nenhum utilizador com nível.")
                    .setColor("Yellow")
                interaction.reply({ embeds: [embed1] })
            }
        }).catch(error => {
            console.error("Erro ao buscar dados:", error);
            const embed2 = new Discord.EmbedBuilder()
                .setDescription("Ocorreu algum erro.")
                .setColor("Red")
            interaction.reply({ embeds: [embed2], ephemeral: true })
        });
    }
}