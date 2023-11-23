const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sc')
        .setDescription('Changes the colour of your highest coloured role.')
        .addStringOption(option => 
            option.setName('colour')
            .setDescription('Colour code of the colour you wish to have.')
            ),
    async execute(interaction, Discord, message, Lyuca, sdPrefix, fs, DatabaseArr, msgArr, cmdArr){
        let base = (interaction) ? interaction : message;
        try{
            if(base.guild.id != `643844726419750922` && !base.member.permissions.has('ManageRoles')) return;
            let colour = message.content.toLowerCase().split(` `).pop();
            switch(colour){
                case 'red': colour = '#FF5555'; break;
                case 'red-orange': colour = '#FF4700'; break;
                case 'orange': colour = '#FF8700'; break;
                case 'yellow': colour = '#FFEB6B'; break;
                case 'green': colour = '#78FF78'; break;
                case 'baby-shit-green': colour = '#607A0E'; break;
                case 'lime': colour = '#00FF00'; break;
                case 'teal': colour = '#00FFF7'; break;
                case 'blue': colour = '#2185FF'; break;
                case 'purple': colour = '#B900FF'; break;
                case 'lavender': colour = '#8D8DE7'; break;
                case 'pink': colour = '#FE99FF'; break;
                case 'indigo': colour = '#7000FF'; break;
                case 'skyy': colour = '#217AFF'; break;
                case 'random': colour = ex.GetRandomColour(); break;
                case 'greyscale':
                    let g = Math.floor(Math.random() * 256).toString(16);
                    colour = `#${g}${g}${g}`;
                    break;
            };
            if(colour.match(/[g-z]/g)) throw new Error("Invalid Colour");
            let validColour = parseInt(`0x${colour.replace(`#`,``)}`);
            if(isNaN(validColour) || validColour < 1 || validColour > 0xFFFFFF) throw new Error("Invalid Colour");
            const ex = require('../../functions');
            colour = colour.toLowerCase();
            if(!colour.match(/[a-f]/g)){
                colour = ex.decToHexString(colour);
            }
            let roles = base.member.roles.cache;
            let colouredRole;
            let count = 250;
            while(!colouredRole){
                let role = roles.find(r => r.rawPosition == count);
                if(!role){
                    count--;
                    continue;
                }
                if(role.color != 0){
                    colouredRole = role;
                    break;
                }
                count--;
            }
            if(!colouredRole){
                base.reply(`No role with any colour found. Please add a role with a non default colour.`);
            }
            await colouredRole.edit({color: colour});  
        }catch(e){
            return base.reply(`# YOU FUCKED UP \n(${e.message})`);
        }
    }
}