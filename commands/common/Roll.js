const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Roll a number of dice, with side numbers of your choosing.')
        .addStringOption(option => 
            option.setName('dice')
            .setDescription(`Dice you'd like to roll in traditional format, ie -> 3d6`)),
    async execute(interaction, Discord, message, Lyuca, sdPrefix, fs, DatabaseArr, msgArr, cmdArr){
        let base;
        let options;
        if(interaction){
            options = interaction.options.getString('dice');
            base = interaction;
        }else{
            options = message.content;
            base = message;
        }
        let diceNum = +options.split('d')[0].replace(/[^0-9]/g, '');
        let sideNum = +options.split('d')[1].replace(/[^0-9]/g, '');
        if(!diceNum || !sideNum){
            return base.reply(`Check your formatting, missing side number or dice number.`);
        }
        if(diceNum > 15 || diceNum < 1){
            return base.reply(`Please roll between 1 - 15 dice.`);
        }
        if(sideNum > 20 || sideNum < 1){
            return base.reply(`Please select between 1 - 20 sides`);
        }
        let rolls = [];
        for(let i = 0; i < diceNum; i++){
            let roll = Math.floor(Math.random() * sideNum) + 1;
            let line = `Roll ${i + 1}   ->   **${roll}**.`
            rolls.push(line);
        }
        rolls = rolls.join("\n");
        base.reply(rolls);
    }
}