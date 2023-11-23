const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nword')
        .setDescription('Displays your nword count.')
        .addStringOption(option => 
            option.setName('user')
            .setDescription('User you wish to choose.')),
    async execute(interaction, Discord, message, Lyuca, sdPrefix, fs, DatabaseArr, msgArr, cmdArr) {

        function numberWithCommas(x) {
            return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        }

        let nwordcount = DatabaseArr[7];
        let ex = require('../../functions');
        let member;
        let author;
        let base;
        if(message){
            base = message;
            member = await ex.FindMember(message, msgArr) || message.member;
            author = message.member.user;
        }else{
            base = interaction;
            let target = interaction.options.getString('user');
            if(target){
                target = await ex.FindMember(interaction, target);
                member = target;
                author = target.user;
            }else{
                member = interaction;
                author = interaction.user;
            }
        }
        let based = await nwordcount.findOne({where: {uid:member.user.id}});
        let pre = member.user.username;
        if(based){
            let hardR = based.nwordHardR;
            let nwordTotal = based.nwordTotal;
            if(base.member.user.id == member.user.id){
                pre = 'You have';
            }else{
                pre = author.displayName;
            }
            nwordTotal = numberWithCommas(nwordTotal);
            hardR = numberWithCommas(hardR);
            let msg = `${pre} said the nword ${nwordTotal} times. (${hardR} times with the hard R)`;
            return base.reply(msg);
        }else{
            if(message.author.id == member.user.id){
                pre = 'You have';
            }
            return base.reply(`${pre} said nword the exactly 0 times, unbased.`);
        }
    }
}