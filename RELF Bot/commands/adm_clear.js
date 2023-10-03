const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")

module.exports = {

    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('[ Administração ] Limpe o chat.')
        .addIntegerOption(option =>
            option.setName('quantidade')
                .setDescription('Qual a quantidade a apagar?')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Qual usuário?')
                .setRequired(false))
        .addChannelOption(option =>
            option.setName('canal')
                .setDescription('Em qual canal?')
                .setRequired(false)
                .addChannelTypes(Discord.ChannelType.GuildText)),

    async execute(client, interaction) {
        let amount = interaction.options.getInteger("quantidade");
        let User = interaction.options.getUser("usuario");
        let canal = interaction.options.getChannel("canal") || interaction.channel;
        let Response = new Discord.EmbedBuilder().setColor('Green');

        const Messages = await canal.messages.fetch();
        let sem_perm = new Discord.EmbedBuilder()
            .setDescription(`🚫 | Não tens permissão para utilizar este comando!`)
            .setColor("Red");

        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageMessages)) {
            interaction.reply({ embeds: [sem_perm], ephemeral: true }).then(() => {
                setTimeout(() => {
                    interaction.deleteReply()
                }, 8000);
            })
        } else {
            if (amount > 100 || amount < 1) {
                let valores = new Discord.EmbedBuilder()
                    .setDescription("❌ | Informe um valor entre `1` e `100`!")
                    .setColor("Yellow");
                interaction.reply({ embeds: [valores], ephemeral: true }).then(() => {
                    setTimeout(() => {
                        interaction.deleteReply()
                    }, 8000);
                })
            }

            if (User) {
                let i = 0;
                const filtered = [];
                (await Messages).filter((m) => {
                    if (m.author.id === User.id && amount > i) {
                        filtered.push(m);
                        i++;
                    }
                });
                canal.bulkDelete(filtered, true).then(async (messages) => {
                    Response.setDescription(`:recycle: | Foram deletadas **__${messages.size}__** mensagens de \`${User.tag}\`.`);
                    interaction.reply({ embeds: [Response] });
                }).then(() => {
                    setTimeout(() => {
                        interaction.deleteReply();
                    }, 8000)
                });
            } else {
                canal.bulkDelete(amount, true).then(async (messages) => {
                    Response.setDescription(`:recycle: | Foram deletadas **__${messages.size}__** mensagens.`);
                    interaction.reply({ embeds: [Response] })
                }).then(() => {
                    setTimeout(() => {
                        interaction.deleteReply();
                    }, 8000)
                });
            }
        }
    }
}