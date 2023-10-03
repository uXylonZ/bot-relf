const fs = require("fs")
const { QuickDB } = require('quick.db')
const config = require("../config.json")
const db = new QuickDB;
const Discord = require("discord.js")

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {

        if (interaction.isSelectMenu()) {
            if (interaction.customId === "painel_ticket") {
                const staff = config.cargo_staff
                let opc = interaction.values[0];
                let categoria = config.categoria_ticket;
                const botao = new Discord.ActionRowBuilder().addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId("fechar_ticket")
                        .setEmoji("🔒")
                        .setLabel("Fechar")
                        .setStyle(Discord.ButtonStyle.Danger),
                    new Discord.ButtonBuilder()
                        .setCustomId("add_ticket")
                        .setEmoji("➕")
                        .setLabel("Adicionar")
                        .setStyle(Discord.ButtonStyle.Success)
                );
                if (!interaction.guild.channels.cache.get(categoria)) categoria == null;
                if (opc === "opc1") {
                    let nome = `recutamento-${interaction.user.username}`;
                    if (interaction.guild.channels.cache.find(c => c.topic == `Ticket de ${interaction.user.username}.`)) {
                        let aberto = new Discord.EmbedBuilder()
                            .setDescription(`Já possuis um ticket aberto! ${interaction.guild.channels.cache.find(c => c.topic == `Ticket de ${interaction.user.username}.`)}`)
                            .setColor("Red");
                        interaction.reply({ embeds: [aberto], ephemeral: true }).then(() => {
                            setTimeout(() => {
                                interaction.deleteReply()
                            }, 8000);
                        })
                    } else {
                        interaction.guild.channels.create({
                            name: nome,
                            type: Discord.ChannelType.GuildText,
                            parent: categoria,
                            topic: `Ticket de ${interaction.user.username}.`,
                            permissionOverwrites: [
                                {
                                    id: interaction.guild.id,
                                    deny: [
                                        Discord.PermissionFlagsBits.ViewChannel
                                    ]
                                },
                                {
                                    id: interaction.user.id,
                                    allow: [
                                        Discord.PermissionFlagsBits.ViewChannel,
                                        Discord.PermissionFlagsBits.SendMessages,
                                        Discord.PermissionFlagsBits.AttachFiles,
                                        Discord.PermissionFlagsBits.EmbedLinks,
                                        Discord.PermissionFlagsBits.AddReactions,
                                    ]
                                },
                                {
                                    id: interaction.guild.roles.cache.get(staff),
                                    allow: [
                                        Discord.PermissionFlagsBits.ViewChannel,
                                        Discord.PermissionFlagsBits.SendMessages,
                                        Discord.PermissionFlagsBits.AttachFiles,
                                        Discord.PermissionFlagsBits.EmbedLinks,
                                        Discord.PermissionFlagsBits.AddReactions,
                                    ]
                                }
                            ]
                        }).then((ch) => {
                            let canal = new Discord.EmbedBuilder()
                                .setDescription(`✅ | O teu ticket foi criado! ${ch}`)
                                .setColor("Green");
                            interaction.reply({ embeds: [canal], ephemeral: true }).then(() => {
                                setTimeout(() => {
                                    interaction.deleteReply()
                                }, 8000);
                            })
                            let embed = new Discord.EmbedBuilder()
                                .setTitle(`Olá querido(a) ${interaction.user.username}`)
                                .setDescription(`
Bem-vindo(a) à nossa central de atendimento, peço que expliques detalhadamente o que precisas.

👥・\`Utilizador\`: ${interaction.user}
📕・\`Motivo\`: **Recrutamento**

Apresenta todas as informações necessárias para ajudar na rapidez de resposta ao ticket.

**Assim que terminar o seu atendimento podes fechar o ticket.**
`)
                                .setColor("White");
                            

                            ch.send({ content: `${interaction.user}`, embeds: [embed], components: [botao] }).then((m) => {
                                m.pin()
                            })
                        })
                    }

                } else if (opc === "opc2") {
                    let nome = `dúvidas-${interaction.user.username}`;
                    if (interaction.guild.channels.cache.find(c => c.topic == `Ticket de ${interaction.user.username}.`)) {
                        let aberto = new Discord.EmbedBuilder()
                            .setDescription(`Já possuis um ticket aberto! ${interaction.guild.channels.cache.find(c => c.topic == `Ticket de ${interaction.user.username}.`)}`)
                            .setColor("Red");
                        interaction.reply({ embeds: [aberto], ephemeral: true }).then(() => {
                            setTimeout(() => {
                                interaction.deleteReply()
                            }, 8000);
                        })
                    } else {
                        interaction.guild.channels.create({
                            name: nome,
                            type: Discord.ChannelType.GuildText,
                            parent: categoria,
                            topic: `Ticket de ${interaction.user.username}.`,
                            permissionOverwrites: [
                                {
                                    id: interaction.guild.id,
                                    deny: [
                                        Discord.PermissionFlagsBits.ViewChannel
                                    ]
                                },
                                {
                                    id: interaction.user.id,
                                    allow: [
                                        Discord.PermissionFlagsBits.ViewChannel,
                                        Discord.PermissionFlagsBits.SendMessages,
                                        Discord.PermissionFlagsBits.AttachFiles,
                                        Discord.PermissionFlagsBits.EmbedLinks,
                                        Discord.PermissionFlagsBits.AddReactions,
                                    ]
                                },
                                {
                                    id: interaction.guild.roles.cache.get(staff),
                                    allow: [
                                        Discord.PermissionFlagsBits.ViewChannel,
                                        Discord.PermissionFlagsBits.SendMessages,
                                        Discord.PermissionFlagsBits.AttachFiles,
                                        Discord.PermissionFlagsBits.EmbedLinks,
                                        Discord.PermissionFlagsBits.AddReactions,
                                    ]
                                }
                            ]
                        }).then((ch) => {
                            let canal = new Discord.EmbedBuilder()
                                .setDescription(`✅ | O teu ticket foi criado! ${ch}`)
                                .setColor("Green");
                            interaction.reply({ embeds: [canal], ephemeral: true }).then(() => {
                                setTimeout(() => {
                                    interaction.deleteReply()
                                }, 8000);
                            })
                            let embed = new Discord.EmbedBuilder()
                                .setTitle(`Olá querido(a) ${interaction.user.username}`)
                                .setDescription(`
Bem-vindo(a) à nossa central de atendimento, peço que expliques detalhadamente o que precisas.

👥・\`Utilizador\`: ${interaction.user}
📕・\`Motivo\`: **Dúvidas**

Apresenta todas as informações necessárias para ajudar na rapidez de resposta ao ticket.

**Assim que terminar o seu atendimento podes fechar o ticket.**
`)
                                .setColor("Red");
                            ch.send({ content: `${interaction.user}`, embeds: [embed], components: [botao] }).then((m) => {
                                m.pin()
                            })
                        })
                    }
                } else if (opc === "opc3") {
                    let nome = `report-${interaction.user.username}`;
                    if (interaction.guild.channels.cache.find(c => c.topic == `Ticket de ${interaction.user.username}.`)) {
                        let aberto = new Discord.EmbedBuilder()
                            .setDescription(`Já possuis um ticket aberto! ${interaction.guild.channels.cache.find(c => c.topic == `Ticket de ${interaction.user.username}.`)}`)
                            .setColor("Red");
                        interaction.reply({ embeds: [aberto], ephemeral: true }).then(() => {
                            setTimeout(() => {
                                interaction.deleteReply()
                            }, 8000);
                        })
                    } else {
                        interaction.guild.channels.create({
                            name: nome,
                            type: Discord.ChannelType.GuildText,
                            parent: categoria,
                            topic: `Ticket de ${interaction.user.username}.`,
                            permissionOverwrites: [
                                {
                                    id: interaction.guild.id,
                                    deny: [
                                        Discord.PermissionFlagsBits.ViewChannel
                                    ]
                                },
                                {
                                    id: interaction.user.id,
                                    allow: [
                                        Discord.PermissionFlagsBits.ViewChannel,
                                        Discord.PermissionFlagsBits.SendMessages,
                                        Discord.PermissionFlagsBits.AttachFiles,
                                        Discord.PermissionFlagsBits.EmbedLinks,
                                        Discord.PermissionFlagsBits.AddReactions,
                                    ]
                                },
                                {
                                    id: interaction.guild.roles.cache.get(staff),
                                    allow: [
                                        Discord.PermissionFlagsBits.ViewChannel,
                                        Discord.PermissionFlagsBits.SendMessages,
                                        Discord.PermissionFlagsBits.AttachFiles,
                                        Discord.PermissionFlagsBits.EmbedLinks,
                                        Discord.PermissionFlagsBits.AddReactions,
                                    ]
                                }
                            ]
                        }).then((ch) => {
                            let canal = new Discord.EmbedBuilder()
                                .setDescription(`✅ | O teu ticket foi criado! ${ch}`)
                                .setColor("Green");
                            interaction.reply({ embeds: [canal], ephemeral: true }).then(() => {
                                setTimeout(() => {
                                    interaction.deleteReply()
                                }, 8000);
                            })
                            let embed = new Discord.EmbedBuilder()
                                .setTitle(`Olá querido(a) ${interaction.user.username}`)
                                .setDescription(`
Bem-vindo(a) à nossa central de atendimento, peço que expliques detalhadamente o que precisas.

👥・\`Utilizador\`: ${interaction.user}
📕・\`Motivo\`: **Reportar**

Apresenta todas as informações necessárias para ajudar na rapidez de resposta ao ticket.

**Assim que terminar o seu atendimento podes fechar o ticket.**
`)
                                .setColor("Grey");
                            ch.send({ content: `${interaction.user}`, embeds: [embed], components: [botao] }).then((m) => {
                                m.pin()
                            })
                        })
                    }
                } else if (opc === "opc4") {
                    let nome = `sugestão-${interaction.user.username}`;
                    if (interaction.guild.channels.cache.find(c => c.topic == `Ticket de ${interaction.user.username}.`)) {
                        let aberto = new Discord.EmbedBuilder()
                            .setDescription(`Já possuis um ticket aberto! ${interaction.guild.channels.cache.find(c => c.topic == `Ticket de ${interaction.user.username}.`)}`)
                            .setColor("Red");
                        interaction.reply({ embeds: [aberto], ephemeral: true }).then(() => {
                            setTimeout(() => {
                                interaction.deleteReply()
                            }, 8000);
                        })
                    } else {
                        interaction.guild.channels.create({
                            name: nome,
                            type: Discord.ChannelType.GuildText,
                            parent: categoria,
                            topic: `Ticket de ${interaction.user.username}.`,
                            permissionOverwrites: [
                                {
                                    id: interaction.guild.id,
                                    deny: [
                                        Discord.PermissionFlagsBits.ViewChannel
                                    ]
                                },
                                {
                                    id: interaction.user.id,
                                    allow: [
                                        Discord.PermissionFlagsBits.ViewChannel,
                                        Discord.PermissionFlagsBits.SendMessages,
                                        Discord.PermissionFlagsBits.AttachFiles,
                                        Discord.PermissionFlagsBits.EmbedLinks,
                                        Discord.PermissionFlagsBits.AddReactions,
                                    ]
                                },
                                {
                                    id: interaction.guild.roles.cache.get(staff),
                                    allow: [
                                        Discord.PermissionFlagsBits.ViewChannel,
                                        Discord.PermissionFlagsBits.SendMessages,
                                        Discord.PermissionFlagsBits.AttachFiles,
                                        Discord.PermissionFlagsBits.EmbedLinks,
                                        Discord.PermissionFlagsBits.AddReactions,
                                    ]
                                }
                            ]
                        }).then((ch) => {
                            let canal = new Discord.EmbedBuilder()
                                .setDescription(`✅ | O teu ticket foi criado! ${ch}`)
                                .setColor("Green");
                            interaction.reply({ embeds: [canal], ephemeral: true }).then(() => {
                                setTimeout(() => {
                                    interaction.deleteReply()
                                }, 8000);
                            })
                            let embed = new Discord.EmbedBuilder()
                                .setTitle(`Olá querido(a) ${interaction.user.username}`)
                                .setDescription(`
Bem-vindo(a) à nossa central de atendimento, peço que expliques detalhadamente o que precisas.

👥・\`Utilizador\`: ${interaction.user}
📕・\`Motivo\`: **Sugestões**

Apresenta todas as informações necessárias para ajudar na rapidez de resposta ao ticket.

**Assim que terminar o seu atendimento podes fechar o ticket.**
`)
                                .setColor("Yellow");
                            ch.send({ content: `${interaction.user}`, embeds: [embed], components: [botao] }).then((m) => {
                                m.pin()
                            })
                        })
                    }
                }
            }
        }
    }
}