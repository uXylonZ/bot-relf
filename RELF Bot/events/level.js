const Discord = require("discord.js")
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    name: 'messageCreate',
    async execute(message) {

        if (!message.author.bot) {
            const userId = message.author.id;
            var atualxp = await db.get(`xp_${userId}`)
            if (atualxp >= 100) {
                await db.add(`level_${userId}`, 1);
                var atuallevel = await db.get(`level_${userId}`)
                let embed = new Discord.EmbedBuilder()
                    .setDescription(`✅ | Parabéns **${message.author.username}**, subis-te para o nível **${atuallevel}** !`)
                    .setColor("Green");
                message.channel.send({ embeds: [embed] });
                await db.set(`xp_${userId}`, 0);
            } else {
                var xp = 0

                var xpToAdd = Math.floor(Math.random() * 20) + 1;
                xp += xpToAdd;

                await db.add(`xp_${userId}`, xp);
            }
        }
    }
}
