const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
module.exports= {
    name: 'clearserver',
    data: new SlashCommandBuilder()
        .setName('clearserver')
        .setDescription('Completely erase all current settings for the server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    execute(interaction, Discord, message, Lyuca, sdPrefix, fs, DatabaseArr, msgArr, cmdArr){
        let base = (interaction) ? interaction : message;
        if(!base.member.permissions.has(PermissionFlagsBits.Administrator)){
            return message.reply(`You lack rizz.`);
        }
        let serverSettings = DatabaseArr[1];
        try{
            serverSettings.destroy({where: {serverId: base.guild.id}});
            return base.reply(`Server settings purged.`)
        }catch(e){
            base.reply(`Something went wrong.`)
        }
    }
}