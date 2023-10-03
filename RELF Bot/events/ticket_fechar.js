const fs = require("fs")
const { QuickDB } = require('quick.db')
const db = new QuickDB;
const config = require("../config.json")
const Discord = require("discord.js")
const { TextInputStyle } = require(`discord.js`)


module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {


        if (interaction.isButton()) {
            if (interaction.customId === "fechar_ticket") {
                let membro = await interaction.guild.members.fetch(interaction.user.id)
                let cargo = interaction.guild.roles.cache.get(config.cargo_staff)
                if (membro.roles.cache.has(cargo.id)) {
                    let fechando = new Discord.EmbedBuilder()
                        .setDescription(`Olá, ${interaction.user}, este ticket será excluido em 5 segundos...`)
                        .setColor("Yellow");
                    interaction.reply({ embeds: [fechando] }).then(() => {
                        setTimeout(() => {
                            let embed = new Discord.EmbedBuilder()
                                .setDescription(`Trancript do canal realizado!`)
                                .setColor("Yellow");
                            interaction.channel.send({ embeds: [embed] })
                        }, 2000)

                        setTimeout(() => {
                            try {
                                interaction.channel.delete().catch(e => { return; })
                            } catch (e) {
                                return;
                            }
                        }, 5000)
                    })
                    async function generateTranscript(channel) {
                        try {
                            const messages = await channel.messages.fetch({ limit: 100 }); // Obtenha as últimas 100 mensagens do canal

                            let transcript = '';

                            messages.forEach((message) => {
                                if (message.author.id !== client.user.id) { // Ignorar mensagens enviadas pelo bot
                                    const timestamp = `[${formatTimestamp(message.createdAt)}]`;
                                    const author1 = message.author.username;
                                    const content = message.cleanContent;

                                    transcript += `**${author1}(${message.author.id})** - ${timestamp}: \`\`\`${content}\`\`\`\n`;
                                }
                            });

                            if (transcript.length === 0) {
                                transcript = `**Não houve nenhum diálogo.**`;
                            }

                            return transcript;
                        } catch (error) {
                            console.error('Erro ao obter mensagens do canal:', error);
                            return null;
                        }
                    }
                    function formatTimestamp(date) {
                        const hours = date.getHours().toString().padStart(2, '0');
                        const minutes = date.getMinutes().toString().padStart(2, '0');
                        const day = date.getDate().toString().padStart(2, '0');
                        const month = (date.getMonth() + 1).toString().padStart(2, '0');
                        const year = date.getFullYear().toString();

                        return `${hours}:${minutes} - ${day}/${month}/${year}`;
                    }
                    const channel = interaction.channel
                    const transcript = await generateTranscript(channel);

                    if (transcript) {
                        const transcriptEmbed = new Discord.EmbedBuilder()
                            .setTitle(`Transcript do canal (${interaction.channel.name})`)
                            .setDescription(transcript)
                            .setFooter({ text: `Ticket fechado por: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                            .setColor('#00FF00');

                        const transcriptChannel = client.channels.cache.get(config.canal_transcripts); // Obtenha o canal de transcript

                        if (transcriptChannel) {
                            setTimeout(() => {
                                transcriptChannel.send({ embeds: [transcriptEmbed] }); // Envie a embed do transcript
                            }, 2000)
                        } else {
                            let embed = new Discord.EmbedBuilder()
                                .setDescription(`❌ | Canal de transcript inválido.`)
                                .setColor("Red")
                            channel.send({ embeds: [embed] });
                        }
                    } else {
                        let embed = new Discord.EmbedBuilder()
                            .setDescription(`❌ | Erro ao gerar o transcript.`)
                            .setColor("Red")
                        channel.send({ embeds: [embed] });
                    }
                } else {
                    let embed = new Discord.EmbedBuilder()
                        .setDescription(`🚫 | Apenas os <@&${config.cargo_staff}> podem fechar o ticket.`)
                        .setColor("Red")
                    interaction.reply({ embeds: [embed], ephemeral: true })
                }
            } else if (interaction.customId === "add_ticket") {
                let membro = await interaction.guild.members.fetch(interaction.user.id)
                let cargo = interaction.guild.roles.cache.get(config.cargo_staff)
                if (membro.roles.cache.has(cargo.id)) {
                    const modal = new Discord.ModalBuilder()
                        .setCustomId(`addticket`)
                        .setTitle(`Adiciona uma pessoa ao ticket!`)
                    const TítuloEmbed = new Discord.TextInputBuilder()
                        .setCustomId(`TítuloEmbed`)
                        .setLabel(`Coloca o ID da pessoa:`)
                        .setPlaceholder(`Coloca o ID da pessoa.`)
                        .setStyle(TextInputStyle.Short)

                    const PrimeiraActionRow = new Discord.ActionRowBuilder().addComponents(TítuloEmbed);

                    let canal = interaction.channel
                    modal.addComponents(PrimeiraActionRow)
                    await interaction.showModal(modal);

                    client.once(`interactionCreate`, async interaction => {
                        if (!interaction.isModalSubmit()) return;
                        if (interaction.customId === `addticket`) {

                            const TítuloEmbed = interaction.fields.getTextInputValue(`TítuloEmbed`);

                            let membro = await interaction.guild.members.fetch(TítuloEmbed)

                            canal.permissionOverwrites.edit(membro.id, { ViewChannel: true, SendMessages: true, AttachFiles: true, EmbedLinks: true, AddReactions: true })
                            let embed = new Discord.EmbedBuilder()
                                .setDescription(`✅ | O ${membro} foi adicionado ao ticket com sucesso.`)
                                .setColor("Green")
                            interaction.reply({ embeds: [embed] })
                        }
                    });
                } else {
                    let embed = new Discord.EmbedBuilder()
                        .setDescription(`🚫 | Apenas os <@&${config.cargo_staff}> podem adicionar pessoas no ticket.`)
                        .setColor("Red")
                    interaction.reply({ embeds: [embed], ephemeral: true })
                }

            }
        }
    }
}