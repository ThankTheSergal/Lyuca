const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('restart')
        .setDescription('Restarts the bot')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
        async execute(interaction, Discord, message, Lyuca, sdPrefix, fs, DatabaseArr, msgArr, cmdArr){
            let base = (interaction) ? interaction : message;
            if(base.member.user.id != '252529231215460353') return;
            await base.reply("Restarting...")
            process.exit();
        }
        
}