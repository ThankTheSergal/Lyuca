const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quote')
        .setDescription('Provided a message link, Lyuca will quote it rather than having to visit the message.')
        .addStringOption(option => 
            option.setName('link')
            .setDescription('The link of the message you wish to quote.')
        ),
    async execute(interaction, Discord, message, Lyuca, sdPrefix, fs, DatabaseArr, msgArr, cmdArr){
        let ex = require('../../functions')

        function getMessageId(con){
            let link =  con.split(' ');
            for(let i = 0; i < link.length; i++){
                let tempArr = link[i].split('/');
                if(tempArr[tempArr.length - 1].match(/^\d+$/)){
                        return [tempArr[tempArr.length - 2], tempArr[tempArr.length - 1]];
                }
            }
        }
        let base;
        if(interaction){
            base = interaction;
            base.content = interaction.options.getString('link');
        }else{
            base = message;
        }
        if(!base.content || !base.content.match('discord.com/channels')) return base.reply('Please provide a message link.');

        let [channelId, messageId] = getMessageId(base.content);

        let fetchedChannel = await Lyuca.channels.fetch(channelId);

        if(!fetchedChannel) base.reply('I do not have access to this channel.');

        let fetchedMessage = await fetchedChannel.messages.fetch(messageId);

        if(!fetchedMessage) return base.reply('Could not find message.');

        if(!fetchedMessage.content && fetchedMessage.embeds.length > 0){
            let replyMessage = 'There was no text to quote, but there was an embed. See below.'
            return base.reply({content: replyMessage, embeds: fetchedMessage.embeds});
        }

        console.log(fetchedMessage);
        
        let colour = parseInt(ex.GetColour().replace(/#/g, ''), 16);
        let embedUrl;
        if(fetchedMessage.embeds[0]){
            embedUrl = fetchedMessage.embeds[0].data.url;
        }
        let firstimage = fetchedMessage.attachments.first();
        if(firstimage){
            embedUrl = firstimage.attachment;
        }
        let url = `https://discord.com/channels/${fetchedMessage.guildId}/${fetchedMessage.channelId}/${fetchedMessage.id}`;
        const replyEmbed = {
            color: colour,
            author: {
                name: `${fetchedMessage.author.globalName || fetchedMessage.author.username} once said:`,
            },
            description: `Link to [${fetchedChannel.guild.name} -> ${fetchedChannel.name}](${url})\n\n${fetchedMessage.content}`,
            thumbnail: {
                url: fetchedMessage.author.avatarURL()
            },
            image: {
                url: embedUrl || null
            }
        }
        return base.reply({embeds: [replyEmbed]});
    }
}