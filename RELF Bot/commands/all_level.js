const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription('[ Geral ] Vê o teu level ou o de outra pessoa.')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Qual usuário?')
                .setRequired(false)),
    async execute(client, interaction) {

        let user = interaction.options.getUser("usuario") || interaction.user
        let userId = user.id
        let xp = await db.get(`xp_${userId}`)
        let level = await db.get(`level_${userId}`)
        if (level === null || level === false) level = 0
        if (xp === null || xp === false) xp = 0
        let user1 = interaction.options.getUser("usuario")
        if (user1) {
            let embed = new Discord.EmbedBuilder()
                .setDescription(`O ${user1} está no nível ${level} com ${xp} XP.`)
                .setColor("Yellow");
            interaction.reply({ embeds: [embed] })
        } else {
            let embed = new Discord.EmbedBuilder()
                .setDescription(`Estás no nível ${level} com ${xp} XP.`)
                .setColor("Yellow");
            interaction.reply({ embeds: [embed] })
        }

    }
}