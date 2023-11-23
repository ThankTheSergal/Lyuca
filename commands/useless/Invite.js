const { SlashCommandBuilder, EmbedBuilder } = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`invite`)
        .setDescription(`Provides you with an invite link to the server.`),
    async execute(interaction, Discord, message, Lyuca, sdPrefix, fs, DatabaseArr, msgArr, cmdArr) {
        let base = (interaction) ? interaction : message;
        let ex = require('../../functions');
        let colour = ex.GetColour();
        let embed = new EmbedBuilder()
            .setColor(colour)
            .setTitle(`Invite Lyuca to Your Server!`)
            .setDescription(`[Click link here](https://discordapp.com/api/oauth2/authorize?client_id=647232151049338880&scope=bot&permissions=470674486)\n\n**Default permissions:** \nManage Server, Roles, and Channels\nKick / Ban Members\nManage Nicknames / Change Nickname\nRead / Send Messages\nAttach Files & Embed Links\nRead Message History\nUse External Emoji\nView Server Insights\n\n[Source code if you wish to audit or contribute](https://github.com/ThankTheSergal/Lyuca/)`)
            .setFooter({text: `You can change these as you wish, before or after adding the bot to your server.`, iconURL: Lyuca.user.avatarURL()})
        base.reply({embeds:[embed]});
    }
}