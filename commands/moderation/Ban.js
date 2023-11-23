const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans a user from the server.')
        .addStringOption(option => 
            option.setName('user')
            .setDescription('User that you wish to ban.')
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
                .setTitle(`You are about to ban ${victim.user.username}`)
                .setThumbnail(victim.user.avatarURL())
                .setDescription(`Are you sure you want to ban? Y / N`)
                .setColor(colour);
            base.reply({ embeds: [confirm] });
            const responseFilter = response => response.member == base.member || response.member == victim;
            base.channel.awaitMessages({filter: responseFilter, max: 1, time: 20000, errors: ['time']})
            .then(async (collected) =>{
                let resArr = [
                    `:pinching_hand: ${victim.user.globalName} gave off too much small dick energy.`,
                    `:person_golfing: ${victim.user.globalName} cya retard.`,
                    `:wheelchair: Sorry ${victim.user.globalName}, we don't support handicapped rights.`,
                    `:couple_mm: ${victim.user.globalName} has been found to be a homosexual. He has been forcefully removed.`,
                    'sayanara nigga',
                    `:flying_saucer: ${victim.user.globalName} has been banished to life in Ohio.`,
                    `:pregnant_man: ${victim.user.globalName} is taking a leave of absence.`
                ];
                let rsp = collected.first().content.toLowerCase().replace(/[eso.]/g,'');
                switch(rsp){
                    case 'n': return base.channel.send('Phew, that was close. Could you imagine if you accidentally hit Y? Haha, if only... :rolling_eyes:'); break;
                    case 'y':  
                        try{
                            await message.guild.members.ban(victim);
                        }catch(e){
                            if(e.message.match('Missing Permissions')){
                                resArr = [`${victim || victim.user.id} cannot be banned. Missing permissions or they have a higher rank.`]
                            }
                        }
                        let num = Math.floor(Math.random() * resArr.length);
                        if(num == 4){
                            return message.channel.send('https://cdn.discordapp.com/attachments/639706647434100739/846600309509455943/yt1s.com_-_Sayonara_Ngga.mp4');
                        }
                        let bEmb = new EmbedBuilder()
                            .setDescription(resArr[num])
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