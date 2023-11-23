const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mutes a user for a set time, or permanantly by default.')
        .addStringOption(option => 
            option.setName('user')
            .setDescription('User you wish to mute')
            )
        .addStringOption(option => 
            option.setName('time')
            .setDescription('Time you wish for the user to be muted. Format 1d 2h 3m, spaces optional.')
            ),
    async execute(interaction, Discord, message, Lyuca, sdPrefix, fs, DatabaseArr, msgArr, cmdArr){
        let base, muteTime;
        try{
            const ex = require('../../functions');
            let target;
            if(interaction){
                base = interaction;
                target = interaction.options.getString('user');
                muteTime = '-' + interaction.options.getString('time');
                muteTime = muteTime.replace(' ', '');

            }else{
                base = message;
                target = msgArr;
                if(msgArr.length > 1 && msgArr[msgArr.length - 1].match('-')){
                    muteTime = msgArr.pop();
                }
            }
            if(!base.member.permissions.has(PermissionFlagsBits.ManageRoles)){
                return message.reply(`Go suck some mod's cock if you want to mute someone cuz :sparkles: you don't have power :sparkles:`);
            }
            let pdb = DatabaseArr[9];
            let victim = await ex.FindMember(base, target);
            if(!victim) return base.reply(`You must actually give me someone to mute dumbass.`);
            let muteRole = await base.guild.roles.cache.find(role => role.name == 'LyucaMute'); 
            if(!muteRole){
                let LyRole = base.guild.roles.cache.find(role => role.name == 'Lyuca Bot' || role.name == 'Lyuca');
                if(!LyRole) throw new Error(`Could not find base role for reference`);
                let pos = LyRole.rawPosition;
                muteRole = await message.guild.roles.create({
                        name: `LyucaMute`,
                        color: '#454545',
                        permissions: [],
                        rawPosition: pos,
                })
                if(!muteRole) throw new Error(`Could not create role`);
            }
            if(!muteTime){
                victim.roles.add(muteRole);
                return message.channel.send(`${victim.user.displayName}, for E T E R N I T Y !`);
            }
            let days, hours, minutes;
            let time = Date.now();
            muteTime = muteTime.replace('-', '').split('')
            for(let i = 0; i < muteTime.length; i++){
                if(muteTime[i].match('d')){
                    days = muteTime.slice(i-1, i)
                }
                if(muteTime[i].match('h')){
                    hours = muteTime.slice(i-1, i)
                }
                if(muteTime[i].match('m')){
                    minutes = muteTime.slice(i-1, i)
                }
            }
            let muteDuration = 0;
            if(days) muteDuration += parseInt(days) * 24 * 60 * 60 * 1000;
            if(hours) muteDuration += parseInt(hours) * 60 * 60 * 1000;
            if(minutes) muteDuration =+ parseInt(minutes) * 60 * 1000;
            muteDuration += time;
            let userPenaltyInfo = await pdb.findOne({where: {uid: victim.user.id, gid: base.guild.id}})
            if(!userPenaltyInfo){
                userPenaltyInfo = await pdb.create({
                    uid:            victim.user.id,
                    gid:            base.guild.id,
                    strikes:        '0',
                    banTime:        'None',
                    unbanTime:      'None',
                    muteTime:       time,
                    unmuteTime:     muteDuration,
                    clo:            'None',
                    cloTimeout:     'None',
                })
            }else{
                userPenaltyInfo.update({muteTime: time, unmuteTime: muteDuration});
            }
            victim.roles.add(muteRole);
            let muteMessage = '';
            if(days){
                if(days == '1'){
                    muteMessage += '\n'+ days + ' day';
                }
                else{
                    muteMessage += '\n'+ days + ' days';
                }
            }
            if(hours){
                if(hours == '1'){
                    muteMessage += '\n'+ hours + ' hour';
                }
                else{
                    muteMessage += '\n'+ hours + ' hours';
                }
            }
            if(minutes){
                if(minutes == '1'){
                    muteMessage += '\n'+ minutes + ' minute';
                }
                else{
                    muteMessage += '\n'+ minutes + ' minutes';
                }
            }
            return base.reply(`${victim.user.displayName} has been muted for: ${muteMessage}.`);
        }catch(e){
            return base.reply(`# YOU (or I, but I'm perfect so unlikely) FUCKED UP\n(${e.message})`);
        }
    }
}