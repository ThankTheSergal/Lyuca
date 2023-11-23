const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serg')
        .setDescription('Fetches a random serg image from https://serg.al/'),
    async execute(interaction, Discord, message, Lyuca, sdPrefix, fs, DatabaseArr, msgArr, cmdArr){
        let base = (interaction) ? interaction : message;
        const request = require('request');
        const re = request('https://serg.al/');

        re.on('response', response => {
            let extension = response.headers['content-type'].split('/')[1];
            let counter = fs.readdirSync('./images/Sergals').length;
            response.pipe(fs.createWriteStream('./images/Sergals/placeholder')).on('finish', () =>{
                const path = './images/Sergals/placeholder';
                if(!fs.existsSync(path)){
                    return message.channel.send(`Something went wrong because my code sucks.`)
                }
                fs.renameSync('./images/Sergals/placeholder', `./images/Sergals/Sergal${counter}.${extension}`);
                const ex = require('../../functions');
                let colour = ex.GetColour();
                let sergal = `./images/Sergals/Sergal${counter}.${extension}`;
                let file = new AttachmentBuilder()
                    .setFile(sergal)
                    .setName(`Sergal${counter}.${extension}`)
                let sergEmbed = new EmbedBuilder()
                    .setColor(colour)
                    .setTitle(`Sergal!`)
                    .setDescription(`Brought to you by [serg.al](https://serg.al/)`)
                    .setImage(`attachment://Sergal${counter}.${extension}`)
                base.reply({
                    embeds: [sergEmbed],
                    files: [file]
                });
            })
        })
    }
}