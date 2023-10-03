const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")
const { QuickDB } = require("quick.db")
const db = new QuickDB()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('antilink')
        .setDescription('[ Administração ] Ative/Desative o sistema de antilink no servidor.'),
    async execute(client, interaction) {

        let sem_perm = new Discord.EmbedBuilder()
            .setDescription(`🚫 | Não tens permissão para utilizar este comando!`)
            .setColor("Red");

        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ embeds: [sem_perm], ephemeral: true }).then(() => {
                setTimeout(() => {
                    interaction.deleteReply()
                }, 8000);
            })
        } else {
            let embed_ativo = new Discord.EmbedBuilder()
            .setDescription(`🟢 | ${interaction.user}, o sistema de antilink foi ativado.`)
            .setColor("Green")

            let embed_desativo = new Discord.EmbedBuilder()
            .setDescription(`🔴 | ${interaction.user}, o sistema de antilink foi desativado.`)
            .setColor("Red")

            let confirm = await db.get((`antilink_${interaction.guild.id}`))
            if (confirm === null || confirm === false) {
                interaction.reply({ embeds: [embed_ativo] }).then(() => {
                    setTimeout(() => {
                        interaction.deleteReply()
                    }, 8000);
                })
                await db.set(`antilink_${interaction.guild.id}`, true)
            } else if (confirm === true) {
                interaction.reply({ embeds: [embed_desativo] }).then(() => {
                    setTimeout(() => {
                        interaction.deleteReply()
                    }, 8000);
                })
                await db.set(`antilink_${interaction.guild.id}`, false)
            }
        }

    }
}