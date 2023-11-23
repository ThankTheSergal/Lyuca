const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`news`)
        .setDescription(`Retrieves the patch notes for the current, or a provided version.`)
        .addStringOption(option => 
            option.setName(`version`)
            .setDescription(`The version you would like to read the patch notes from.`)),
    async execute(interaction, Discord, message, Lyuca, sdPrefix, fs, DatabaseArr, msgArr, cmdArr){
        let base = (interaction) ? interaction : message;
        let requestedVersion = (interaction) ? interaction.options.getString('version') : msgArr[0];
        let description, data, title;
        let patchNoteDb = DatabaseArr[12];

        if(!requestedVersion){
            let entries = await patchNoteDb.findAll();
            data = entries[entries.length - 1];
            description = data.dataValues.data;
            title = `Patch notes for version ${data.dataValues.version}`;
        }else{
            let entries = await patchNoteDb.findOne({where: {version: requestedVersion}});
            console.log(entries)
            if(!entries){
                entries = await patchNoteDb.findAll();
                data = entries[entries.length - 1];
                title = `Error: Requested version not found. Diplayed for v${data.dataValues.version}`;
                description = data.dataValues.data;
            }else{
                title = `Patch notes for version ${entries.dataValues.version}`;
                description = entries.dataValues.data;
            }
        }
        const ex = require('../../functions');
        let color = ex.GetColour();
        const newsEmbed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(`Source for Lyuca can be viewed on the [GitHub Repository.](https://github.com/ThankTheSergal/Lyuca)\n\n` + description)
            .setColor(color)
            .setThumbnail(Lyuca.user.avatarURL())
            .setFooter({text: `If there are any bugs (there will be), let me know whenever you see anything that doesn't work as it should. I've been working on this update for a while, but mainly at 3am so there is bound to be typos and errors somewhere.`})
        return base.reply({embeds: [newsEmbed]});
    }
}
