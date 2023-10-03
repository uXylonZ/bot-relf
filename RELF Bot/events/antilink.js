const Discord = require("discord.js")
const { QuickDB } = require("quick.db")
const db = new QuickDB()

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return
        let confirm = await db.get(`antilink_${message.guild.id}`)
        if (confirm === false || confirm === null) {
            return;
        } else if (confirm === true) {
            // if (message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return;
            const linksProb = ["https://discord.com/invite", "discord.gg/", "dc.gg/"]
            if (linksProb.some(links => message.content.toLocaleLowerCase().includes(links))) {
                message.delete().then(() => {
                    setTimeout(() => {
                        let embed = new Discord.EmbedBuilder()
                            .setDescription(`${message.author} não envie links de outros servidores aqui!`)
                            .setColor("Red")
                        message.channel.send({ embeds: [embed] })
                    }, 500);
                })
            }
        }
    }
}