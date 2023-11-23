const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Ask a quesion and get a 100% accurate answer.')
        .addStringOption(option => 
            option.setName('question')
            .setDescription('Question you wish to ask.')),
    async execute(interaction, Discord, message, Lyuca, sdPrefix, fs, DatabaseArr, msgArr, cmdArr){
        let question, base;
        let ex = require('../../functions');
        let colour = ex.GetColour();
        if(message){
            base = message;
            question = message.content.substr(sdPrefix.length + 6);
        }else{
            base = interaction;
            question = interaction.options.getString('question');
        }
        if(!question){
            const file = new AttachmentBuilder('./images/examples/8ballexample.png')
            const noEmbed = new EmbedBuilder()
                .setTitle(`You need to ask a question first. See the example:`)
                .setImage(`attachment://8ballexample.png`)
                .setColor(colour)
            return base.reply({embeds: [noEmbed], files: [file]});
        }
        let answers = [
            "It is certain.",
            "Without a doubt.",
            "Yes, definetly.",
            "Yes.",
            "Of course. I thought it was rather obvious.",
            "Unfortunately, yes.",
            "Does a bear shit in the woods?",
            "Dunno, don't care either.",
            "Bruh.",
            "I don't fucking know? Ask an actual person you mongoloid.",
            "Why the fuck would I know?",
            "No.",
            "Fuck no.",
            "Very doubtful.",
            "My sources say no.",
            "lmao imagine if there was even the slightest of chances.",
            "Hard no on that one chief.",
            "I shouldn't lie to you, the answer isn't very good.",
        ]
        let response = answers[Math.floor(Math.random() * answers.length)];
        question = question.charAt(0).toUpperCase() + question.slice(1);
        console.log(question)
        if(!question.match(/[$]$/g)){
            question += '?';
        }
        const answerEmbed = new EmbedBuilder()
            .setTitle(`${base.member.user.globalName} asks:`)
            .addFields({name: question, value: `${response}`})
            .setColor(colour)
            .setThumbnail(base.member.avatarURL())
        base.reply({embeds: [answerEmbed]})  
    }
}