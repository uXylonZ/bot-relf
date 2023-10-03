const { SlashCommandBuilder } = require('@discordjs/builders');
const { TextInputStyle } = require(`discord.js`)
const { InteractionType } = require(`discord.js`)
const Discord = require(`discord.js`);
const moment = require("moment")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anuncio')
        .setDescription('「 Administração 」Envia um anúncio.')
        .addChannelOption(option =>
            option.setName('canal')
                .setDescription('Escolhe um canal em específico.')
                .setRequired(false)
                .addChannelTypes(Discord.ChannelType.GuildText)),

    async execute(client, interaction) {

        let sem_perm = new Discord.EmbedBuilder()
            .setDescription(`🚫 | Não tens permissão para utilizar este comando!`)
            .setColor("Red");

        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageMessages)) {
            interaction.reply({ embeds: [sem_perm], ephemeral: true }).then(() => {
                setTimeout(() => {
                    interaction.deleteReply()
                }, 8000);
            })
        }

        const modal = new Discord.ModalBuilder()
            .setCustomId(`Embed`)
            .setTitle(`Faz o anúncio!`)
        const TítuloEmbed = new Discord.TextInputBuilder()
            .setCustomId(`TítuloEmbed`)
            .setLabel(`Título do Anúncio`)
            .setPlaceholder(`Insira o título do anúncio.`)
            .setStyle(TextInputStyle.Short)
        const DescriçãoEmbed = new Discord.TextInputBuilder()
            .setCustomId(`DescriçãoEmbed`)
            .setLabel(`Descrição da Anúncio`)
            .setPlaceholder(`Insira a descrição do anúncio.`)
            .setStyle(TextInputStyle.Paragraph)

        const PrimeiraActionRow = new Discord.ActionRowBuilder().addComponents(TítuloEmbed);
        const SegundaActionRow = new Discord.ActionRowBuilder().addComponents(DescriçãoEmbed);

        let canal = interaction.options.getChannel("canal") || interaction.channel
        modal.addComponents(PrimeiraActionRow, SegundaActionRow)
        await interaction.showModal(modal);

        client.once(`interactionCreate`, async interaction => {
            if (!interaction.isModalSubmit()) return;
            if (interaction.customId === `Embed`) {

                const DescriçãoEmbed = interaction.fields.getTextInputValue(`DescriçãoEmbed`);
                const TítuloEmbed = interaction.fields.getTextInputValue(`TítuloEmbed`);

                let embedModal1 = new Discord.EmbedBuilder()
                    .setFooter({ text: `${moment(interaction.createdTimestamp).format("D/MM/YYYY [às] HH:mm")}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                    .setColor("Red")
                    .setTitle(`${TítuloEmbed}`)
                    .setDescription(`${DescriçãoEmbed}`)
                    

                let modal = new Discord.EmbedBuilder()
                    .setDescription(`✅ | **Anúncio enviado com sucesso.**!`)
                    .setColor("Green");
                interaction.reply({ embeds: [modal], ephemeral: true }).then(() => {
                    setTimeout(() => {
                        interaction.deleteReply()
                    }, 8000);
                })

                canal.send({ embeds: [embedModal1] }).catch((e) => {
                    let erro = new Discord.EmbedBuilder()
                        .setDescription(`❌ | **Algo deu errado, por favor tente novamente...**!`)
                        .setColor("Red");
                    interaction.reply({ embeds: [erro], ephemeral: true }).then(() => {
                        setTimeout(() => {
                            interaction.deleteReply()
                        }, 8000);
                    })
                })
            }
        });
    }
}