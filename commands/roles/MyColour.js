const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { col } = require("sequelize");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mc')
        .setDescription('Fetches the colour of your highest non-default coloured role.'),
    async execute(interaction, Discord, message, Lyuca, sdPrefix, fs, DatabaseArr, msgArr, cmdArr){
        let base = (interaction) ? interaction : message;
        let roles = base.member.roles.cache;
        let colouredRole, highestRole;
        let count = 250;
        while(!colouredRole){
            let role = roles.find(r => r.rawPosition == count);
            if(!role){
                count--;
                continue;
            }
            if(!highestRole){
                highestRole = role;
            }
            if(role.color != 0){
                colouredRole = role;
                break;
            }
            count--;
        }
        let colour = colouredRole.color;
        const ex = require('../../functions');
        colour = ex.decToHexString(colour);
        let description;
        if(highestRole != colouredRole){
            description = `Your highest role is **@${highestRole.name}**\n\nYour highest coloured role is @${colouredRole.name}, the colour of which is: **#${colour}**`;
        }else{
            description =`Your highest role is **@${colouredRole.name}**\n\nThe colour of which is: **#${colour}**`;
        }
        let canvas = require('@napi-rs/canvas');
        const thumbnail = canvas.createCanvas(256,256);
        const img = thumbnail.getContext('2d');
        img.fillStyle = `#` + colour;
        img.fillRect(0,0,256,256);
        const finalimage = new AttachmentBuilder(await thumbnail.encode('png'), {name: 'roleColour.png'});
        let embed = new EmbedBuilder()
            .setColor(colour)
            .setTitle(`${base.member.user.displayName}'s role colours:`)
            .setDescription(description)
            .setThumbnail('attachment://roleColour.png')
        return base.reply({embeds: [embed], files: [finalimage]});
    }
}