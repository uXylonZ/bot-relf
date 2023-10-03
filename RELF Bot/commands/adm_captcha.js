const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
const { QuickDB } = require("quick.db")
const config = require("../config.json")
const db = new QuickDB()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('painel-verificar')
        .setDescription('[ Administração ] Painel de Verificação.')
        .addRoleOption(option =>
            option.setName('cargo')
                .setDescription('Qual cargo será o de verificado?')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('canal')
                .setDescription('Escolhe um canal em específico.')
                .addChannelTypes(Discord.ChannelType.GuildText)
                .setRequired(false)),

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

            const cargo = interaction.options.getRole("cargo")
            const canal = interaction.options.getChannel("canal") || interaction.channel
            const botMember = interaction.guild.members.cache.get(config.bot);
            if (botMember.roles.highest.comparePositionTo(cargo) > 0) {
                await db.set(`cargo_verificacao_${interaction.guild.id}`, cargo.id)

                let embed = new Discord.EmbedBuilder()
                    .setColor('Green')
                    .setDescription(`
# Sistema de Verificação

Bem vindo à **${interaction.guild.name}** !!

Olá, em nome da equipa staff esperemos que gostes de estar cá!
    
Para te verificares basta apertares no botão abaixo.

*Caso o sistema não esteja a funcionar envia mensagem privada ao* <@918990446213079080>
                `)
                    .setFooter({ text: `${interaction.guild.name} • Todos os direitos reservados`, iconURL: interaction.guild.iconURL({ dynamic: true }) })

                const botao = new Discord.ButtonBuilder()
                    .setCustomId('botao')
                    .setEmoji('✅')
                    .setLabel('| Verificar')
                    .setStyle(Discord.ButtonStyle.Success);

                const botoes = new Discord.ActionRowBuilder()
                    .addComponents(botao);

                let embed1 = new Discord.EmbedBuilder()
                    .setColor('Green')
                    .setDescription(`✅ | **Painel de verificação** enviado para o ${canal} e o cargo de verificado é ${cargo} !`)

                interaction.reply({ embeds: [embed1], ephemeral: true }).then(() => {
                    setTimeout(() => {
                        interaction.deleteReply()
                    }, 8000);
                })

                canal.send({ embeds: [embed], components: [botoes] })
            } else {
                let embed = new Discord.EmbedBuilder()
                    .setDescription(`**❌ | O cargo escolhido (${cargo}) é superior a mim!**`)
                    .setColor('Red');
                interaction.reply({ embeds: [embed], ephemeral: true }).then(() => {
                    setTimeout(() => {
                        interaction.deleteReply()
                    }, 8000);
                })
            }
        }
    }
}