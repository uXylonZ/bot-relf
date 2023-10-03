const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('[ Administração ] Envia o painel de Tickets.')
        .addChannelOption(option =>
            option.setName('canal')
                .setDescription('Escolhe um canal em específico.')
                .addChannelTypes(Discord.ChannelType.GuildText)
                .setRequired(false)),

    async execute(client, interaction) {

        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
            let sem_perm = new Discord.EmbedBuilder()
                .setDescription(`🚫 | Não tens permissão para utilizar este comando!`)
                .setColor("Red");
            interaction.reply({ embeds: [sem_perm], ephemeral: true }).then(() => {
                setTimeout(() => {
                    interaction.deleteReply()
                }, 8000);
            })
        } else {
            let canal = interaction.options.getChannel("canal") || interaction.channel
            let embed = new Discord.EmbedBuilder()
                .setAuthor({ name: `Tickets - ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setDescription(`
Para abrir um **ticket**, seleciona uma **categoria** de ticket do **menu** abaixo!
                
*Por favor não uses este sistema desnecessáriamente.*
                `)
                .setFooter({ text: `${interaction.guild.name} • Todos os direitos reservados`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setColor("Yellow");
            let painel = new Discord.ActionRowBuilder().addComponents(
                new Discord.StringSelectMenuBuilder()
                    .setCustomId("painel_ticket")
                    .setPlaceholder("Clica para veres as categorias.")
                    .addOptions({
                        emoji: "📝",
                        label: "Recrutamento",
                        description: "Faz o recrutamento para entrares na clan.",
                        value: "opc1"
                    }, {
                        emoji: "❓",
                        label: "Dúvidas",
                        description: "Tira uma dúvida em branco.",
                        value: "opc2"
                    }, {
                        emoji: "🚨",
                        label: "Reportar",
                        description: "Reporta algum usuário/membro/staff.",
                        value: "opc3"
                    }, {
                        emoji: "💡",
                        label: "Sugestões",
                        description: "Dá-nos uma sugestão.",
                        value: "opc4"
                    }));

            let msg_enviada = new Discord.EmbedBuilder()
                .setDescription(`✅ | O painel de tickets foi enviado para ${canal} com sucesso.`)
                .setColor("Green");
            interaction.reply({ embeds: [msg_enviada], ephemeral: true }).then(() => {
                setTimeout(() => {
                    interaction.deleteReply()
                }, 8000);
            })
            canal.send({ embeds: [embed], components: [painel] })

        }
    }
}