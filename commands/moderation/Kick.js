const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a user from the server.')
        .addStringOption(option => 
            option.setName('user')
            .setDescription('User that you wish to kick.')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false),
        async execute(interaction, Discord, message, Lyuca, sdPrefix, fs, DatabaseArr, msgArr, cmdArr){
            let victim;
            let ex = require('../../functions.js');
            if(message){
                if(!message.member.permissions.has(PermissionFlagsBits.BanMembers)){
                    return message.reply(`The fuck you trying to do nigga? You don't have permissions fucktard.`);
                }
                victim = await ex.FindMember(message,msgArr);
            }
            if(interaction){
                victim = interaction.options.getString('user');
                victim = await ex.FindMember(interaction, victim);
            }
            let colour = ex.GetColour();
            let base = message || interaction;
            if(!victim){
                return base.reply("No user found. Perhaps you're too illiterate to spell, wouldn't be surprised with the people on this platform.");
            }
            let confirm = new EmbedBuilder()
                .setTitle(`You are about to kick ${victim.user.username}`)
                .setThumbnail(victim.user.avatarURL())
                .setDescription(`Are you sure you want to kick? Y / N`)
                .setColor(colour);
            base.reply({ embeds: [confirm] });
            const responseFilter = response => response.member == base.member || response.member == victim;
            base.channel.awaitMessages({filter: responseFilter, max: 1, time: 20000, errors: ['time']})
            .then(async (collected) =>{
                let rsp = collected.first().content.toLowerCase().replace(/[eso.]/g,'');
                switch(rsp){
                    case 'n': return base.channel.send('Phew, that was close. Could you imagine if you accidentally hit Y? Haha, if only... :rolling_eyes:'); break;
                    case 'y':  
                        try{
                            await message.guild.members.kick(victim);
                        }catch(e){
                            if(e.message.match('Missing Permissions')){
                                resArr = [`${victim || victim.user.id} cannot be kicked. Missing permissions or they have a higher rank.`]
                            }
                        }
                        let bEmb = new EmbedBuilder()
                            .setDescription(`${victim.user.username} has been kicked.`)
                            .setColor(colour)
                        return base.channel.send({ embeds:[bEmb] });
                    default: return base.channel.send(`I know it's hard, but please gather the last 3 brain cells you have left to give me a proper answer next time.`);
                }
            })
            .catch(async (e) => {
                let h = await base.reply(`Hey retard, answering the question next time might help.`);
                let delay = setInterval(() => {
                    h.delete();
                    clearInterval(delay);
                },10000);
            })
        }
}