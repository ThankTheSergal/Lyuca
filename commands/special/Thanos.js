const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('snap')
        .setDescription('Bans half a server.'),
    async execute(interaction, Discord, message, Lyuca, sdPrefix, fs, DatabaseArr, msgArr, cmdArr){
        let base = (interaction) ? interaction : message;
        if(interaction.member.user.id != '252529231215460353') return;
        base.reply('This will bring you victory, but at what cost?');

        const filter = (response) => {
            return response.member.user.id == '252529231215460353';
        }
        base.channel.awaitMessages({filter: filter, max: 1, time: 30000, errors: ['time']})
        .then(async (collected) => {
            let rsp = collected.first().content.toLowerCase().replace(/[.]/g,'');
            if(rsp != 'everything') return;
            let memberCollection = await message.guild.members.fetch();
            let memberIdList = await memberCollection.map(u => u.id);
            const listSize = memberIdList.length;
            let confirmedKills = [];
            while(confirmedKills.length < listSize / 2){
                let target = Math.floor(Math.random() * listSize);
                let chosenOne = memberIdList.splice(target, 1, 113);
                if(chosenOne != 113){
                    confirmedKills.push(chosenOne);
                }
            }
            let desc = '';
            for(let i = 0; i < confirmedKills.length; i++){
                let member = await base.guild.members.fetch(`${confirmedKills[i]}`);
                if(!member.user) continue;
                desc += `**${member.user.globalName || member.user.username}** isn't feeling so good.\n`;
                target.ban();
            }

            const ex = require('../../functions');
            let colour = ex.GetColour();
            let snapEmbed = new EmbedBuilder()
                .setTitle(`Snap!`)
                .setDescription(desc)
                .setColor(colour)
                .setThumbnail('https://media.tenor.com/TG5OF7UkLasAAAAC/thanos-infinity.gif')
            return base.channel.send({embeds: [snapEmbed]});
        })
        .catch((e) => {
            console.log(e);
        });
    } 
}