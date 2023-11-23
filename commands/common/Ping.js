const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Basic start for slash command support'),
    async execute(interaction, Discord, message, Lyuca) {
        function msToTime(ms) {
            days = Math.floor(ms / 86400000);
            daysms = ms % 86400000;
            hours = Math.floor(daysms / 3600000);
            hoursms = ms % 3600000;
            minutes = Math.floor(hoursms / 60000);
            minutesms = ms % 60000;
            sec = Math.floor(minutesms / 1000);
        
            let str = "";
            if (days) str = str + days + "d ";
            if (hours) str = str + hours + "h ";
            if (minutes) str = str + minutes + "m ";
            if (sec) str = str + sec + "s";
        
            return str;
        }
        const ex = require('../../functions.js');
        let colour = ex.GetColour();
        let botMsg;
        if(!message){
             botMsg = await interaction.reply(`":ping_pong: Pinging..."`);
        }else{
            botMsg = await message.channel.send(`":ping_pong: Pinging..."`);
        }
        let firstMessageTime;
        let avatarURL;
        let author;
        if(!message){
            firstMessageTime = interaction.createdAt;
            avatarURL = interaction.user.avatarURL();
            author = interaction.user.username;
        }else{
            firstMessageTime = message.createdAt;
            avatarURL = message.author.avatarURL();
            author = message.author.tag;
        }
        let pingEmb = new EmbedBuilder()
            .setTitle(`:ping_pong: Ping times:`)
            .setDescription([
                `**Server**: \`${(botMsg.createdAt - firstMessageTime)}ms\``,
                `**API**:    \`${Lyuca.ws.ping}ms\``,
                `**Uptime**: \`${(msToTime(Lyuca.uptime))}\``
            ].join("\n"))
            .setColor(colour)
            .setFooter({
                text: `Requested by ${author}`,
                iconURL: avatarURL
            })
            .setTimestamp(new Date());
        botMsg.edit({
            content: ``,
            embeds: [pingEmb]
        }).catch((e) => {
            botMsg.edit("Error: Missing permissions.");
            console.log(e);
        });
        //return message.reply('Shut up.');
    }
}