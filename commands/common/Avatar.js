const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`av`)
        .setDescription(`Retrieves your, or a user's avatar.`)
        .addStringOption(option => 
            option.setName('user')
            .setDescription(`Select the user who's avatar you wish to display.`)
        )
        .addStringOption(option => 
            option.setName('type')
            .setDescription('Choose the type between global or local avatar.')
        ),
    async execute(interaction, Discord, message, Lyuca, sdPrefix, fs, DatabaseArr, msgArr, cmdArr){
        function SendEmbed(lines, finalImage, base){
            let avatarEmbed = new EmbedBuilder()
            .setDescription(lines[0])
            .addFields({name: `----------------------------`, 
                       value: lines[1]})
            .setColor("#7000FF")
            .setImage(`attachment://avatar.png`)
            .setURL()
            return base.reply({
                embeds: [avatarEmbed],
                files: [finalImage]
            });
        }
        async function GetImage(target){
            const newCanvas = canvas.createCanvas(1024, 1024);
            const img = newCanvas.getContext('2d');
            const { body } = await request(target);
            av = await canvas.loadImage(await body.arrayBuffer());
            img.drawImage(av, 0, 0, 1024, 1024);
            const finalImage = new AttachmentBuilder(await newCanvas.encode('png'), {name: 'avatar.png'});

            return finalImage;
        }
        const ex = require('../../functions');
        const canvas = require('@napi-rs/canvas');
        const { request } = require('undici');
        let lines = [];
        let av, avType, target, base;
        if(interaction){
            target = interaction.options.getString('user');
            avType = interaction.options.getString('type');
            if(target && target.startsWith('<@')){
                target = target.replace(/[<@>]/g, '');
            }
            msgArr = target;
            base = interaction;
        }else{
            if(msgArr[msgArr.length - 1]){
                if(msgArr[msgArr.length - 1].match(/local|global/)){
                    avType = msgArr.pop();
                }
            }
            base = message;
        }
        if(msgArr[0] == `server`){
            avType = message.guild.iconURL({dynamic: true, size: 2048})
            lines[0] = `${message.guild.name}'s Icon:`;
            lines[1] = `View the full icon [here](${avType})`;
            av = await GetImage(avType);
            return SendEmbed(lines, av, base);
        }
        target = await ex.FindMember(base, msgArr, Lyuca) || base.member || base.user;
        switch(avType){
            case 'local': avType = target.avatarURL({format: 'png', size: 1024}); break;
            case 'global': avType = target.user.avatarURL({format: 'png', size: 1024}); break;
            default: avType = target.user.avatarURL({format: 'png', size: 1024}); break;
        }
        const finalImage = await GetImage(avType);
        lines = [`${target}'s avatar:`, `View the full avatar [here](${avType})`];
        return SendEmbed(lines, finalImage, base);
    }
}