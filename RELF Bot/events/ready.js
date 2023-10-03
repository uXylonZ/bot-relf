const Discord = require("discord.js")
const { ActivityType } = require('discord.js');
const config = require("../config.json")
require('colors');

module.exports = {
    name: 'ready',
    async execute(client, commands) {

        const membros = client.users.cache.size

        let status = [
            `a RELF no TOPO`,
            `${membros} membros`,
        ]
        let status2 = [ 
            ActivityType.Watching,
            ActivityType.Listening,
        ]
        i = 0
        y = 0

        setInterval(() => {
            client.user.setPresence({ 
                activities: [{ 
                    name: `${status[i++ % status.length]}`, 
                    type: status2[y++ % status2.length]
                }], status: "dnd" }) // Status: 🟢 online | 🟠 idle | 🔴 dnd | ⚫ invisible
        }, 12000);

        console.log(`Estou ligado em `.green + `${client.user.username}`.white)
    }
}