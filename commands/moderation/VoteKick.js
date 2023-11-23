const { SlashCommandBuilder, AttachmentBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('votekick')
        .setDescription('Calls a vote to kick a certain member, I love democracy.')
        .addStringOption(option => 
            option.setName('target')
            .setDescription('User you wish to vote to kick.'))
        .addStringOption(option => 
            option.setName('votes')
            .setDescription('Number of votes required to trigger the kick. Minimum of 3. Maximum of 10.')),
    async execute(interaction, Discord, message, Lyuca, sdPrefix, fs, DatabaseArr, msgArr, cmdArr){
        let base = (interaction) ? interaction : message;
        let target = (interaction) ? [interaction.options.getString('target')] : msgArr;
        let requiredVotes = (interaction) ? interaction.options.getString('votes') : msgArr.pop();
        if(interaction && !requiredVotes){
            requiredVotes = 4;
        }
        if(message && msgArr.length < 1){
            target = requiredVotes;
            requiredVotes = 4;
        }
        if(requiredVotes < 3){
            requiredVotes = 3
        }
        if(requiredVotes > 10){
            requiredVotes = 10
        }
        const ex = require('../../functions');
        let member = await ex.FindMember(base, target);
        const canvas = require('@napi-rs/canvas');
        const newCanvas = canvas.createCanvas(808, 148);
        const img = newCanvas.getContext('2d');
        const template = await canvas.loadImage('./images/examples/votekickexample.png');
        img.drawImage(template, 0,0, 808, 148);
        img.font = '55px Arial';
        img.fillStyle = `#FFFFFF`;

        let fontSize = 55;
        while(img.measureText(member.user.globalName || member.user.username).width > newCanvas.width * 0.74){
            img.font = `${fontSize -= 1}px Arial`;
        }
        img.fillText(member.user.globalName || member.user.username, 70, 55);

        img.fillStyle = '#ECEDF1';
        img.font = '50px Arial';
        img.fillText(`0/${requiredVotes}`, 700, 52);
        const finalImage = new AttachmentBuilder(await newCanvas.encode('png'), {name: 'votekick.png'});
        let msg =  await base.reply('Loading...');

        let m = await base.channel.send({files: [finalImage]});
        await msg.delete();
        await m.react('✅');
        const filter = async (reaction, user) => {
            let member = await base.guild.members.fetch(user.id);
            if(member.permissions.has(PermissionFlagsBits.KickMembers) && reaction.emoji.name == '✅' || reaction.message.guild.id == '974822450498002944') return true;
        };
        m.awaitReactions({ filter: filter, max: requiredVotes, time: 60000, errors:[`time`] })
        .then(() => {
            base.channel.send('Vote Passed.');
            member.kick();
            return base.channel.send(`${member.user.username} has been kicked.`);
        }).catch(e => {
            return base.channel.send('Vote Failed.');
        });
    }
}