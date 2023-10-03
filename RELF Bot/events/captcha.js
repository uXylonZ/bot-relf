const Discord = require("discord.js")
const { QuickDB } = require('quick.db');
const config = require("../config.json")
const db = new QuickDB();

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (interaction.customId === 'botao') {
            const member = await interaction.guild.members.fetch(interaction.user.id);
            const role = await db.get(`cargo_verificacao_${interaction.guild.id}`)  // interaction.guild.roles.cache.get(config.cargo_verificacao)
            const cargo = interaction.guild.roles.cache.get(role)
            const botMember = interaction.guild.members.cache.get(config.bot);
            if (cargo) {
                if (botMember.roles.highest.comparePositionTo(cargo) > 0) {
                    if (!member.roles.cache.has(cargo.id)) {
                        const caracteres = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                        let codigo = '';
                        for (let i = 0; i < 10; i++) {
                            codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
                        }
                        await db.set(`codigo_${interaction.user.id}`, codigo)

                        const modal = new Discord.ModalBuilder()
                            .setCustomId(`captcha2`)
                            .setTitle(`Código: ${codigo}`)
                        const TítuloEmbed = new Discord.TextInputBuilder()
                            .setCustomId(`Codigo`)
                            .setLabel(`O código está no titúlo`)
                            .setPlaceholder(`O código está no titúlo`)
                            .setStyle(Discord.TextInputStyle.Short)

                        const PrimeiraActionRow = new Discord.ActionRowBuilder().addComponents(TítuloEmbed);

                        modal.addComponents(PrimeiraActionRow);
                        await interaction.showModal(modal);
                    } else {
                        let embed = new Discord.EmbedBuilder()
                            .setDescription(`**❌ | Parece que já estás verificado!**`)
                            .setColor('Red');
                        interaction.reply({ embeds: [embed], ephemeral: true }).then(() => {
                            setTimeout(() => {
                                interaction.deleteReply()
                            }, 8000);
                        })
                    }

                } else {
                    let embed = new Discord.EmbedBuilder()
                        .setDescription(`**❌ | O cargo de verificação (${cargo}) é superior a mim!**`)
                        .setColor('Red');
                    interaction.reply({ embeds: [embed], ephemeral: true }).then(() => {
                        setTimeout(() => {
                            interaction.deleteReply()
                        }, 8000);
                    })
                }
            } else {
                let embed = new Discord.EmbedBuilder()
                    .setDescription(`**❌ | O cargo de verificação que foi inserido não existe neste servidor!**`)
                    .setColor('Red');
                interaction.reply({ embeds: [embed], ephemeral: true }).then(() => {
                    setTimeout(() => {
                        interaction.deleteReply()
                    }, 8000);
                })
            }

        } else if (interaction.customId === `captcha2`) {

            let codigo1 = await db.get(`codigo_${interaction.user.id}`)
            let codigo2 = interaction.fields.getTextInputValue(`Codigo`);
            let canal = interaction.channel
            if (codigo2 === codigo1) {
                let embed = new Discord.EmbedBuilder()
                    .setDescription(`**✅ | Parabéns acabas-te de te verificar!**`)
                    .setColor('Green');
                interaction.reply({ embeds: [embed], ephemeral: true }).then(() => {
                    setTimeout(() => {
                        interaction.deleteReply()
                    }, 8000);
                })
                let member = await interaction.guild.members.fetch(interaction.user.id);
                let cargo = interaction.guild.roles.cache.get(config.cargo_verificacao)
                member.roles.add(cargo)
            } else {
                let embed = new Discord.EmbedBuilder()
                    .setDescription(`**❌ | Erras-te o código!**`)
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
