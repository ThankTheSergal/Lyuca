const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Unmutes a user.')
        .addStringOption(option => 
            option.setName('user')
            .setDescription('User you wish to unmute.')
            ),
    async execute(interaction, Discord, message, Lyuca, sdPrefix, fs, DatabaseArr, msgArr, cmdArr){
        const ex = require('../../functions');
        let base, target;
        if(interaction){
            base = interaction;
            target = interaction.options.getString('user')
        }else{
            base = message;
            target = msgArr;
        }
        if(!base.member.permissions.has(PermissionFlagsBits.ManageRoles)){
            return message.reply(`Go suck some mod's cock if you want to mute someone cuz :sparkles: you don't have power :sparkles:`);
        }
        try{
            let victim = await ex.FindMember(base, target);
            if(!victim) return base.reply(`You must actually give me someone to mute dumbass.`);
            let muteRole = await base.guild.roles.cache.find(role => role.name == 'LyucaMute'); 
            if(!muteRole){
                let LyRole = base.guild.roles.cache.find(role => role.name == 'Lyuca Bot');
                if(LyRole) throw new Error(`Could not find base role for reference.`);
            }
            let hasRole = victim.roles.cache.find(r => r.name == 'LyucaMute');
            if(!hasRole) throw new Error(`This user has not been muted`);
            victim.roles.remove(hasRole);
            return base.reply(`${victim.user.displayName} has been unmuted.`);
        }catch(e){
            return base.reply(`:rotating_light:   **ERROR: USER IS RETARDED**   :rotating_light:\n(${e.message})`);
        }
    }
}