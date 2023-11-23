const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('prune')
        .setDescription('Deletes a specified amount of messages up to 100.')
        .addStringOption(option => 
            option.setName('quantity')
            .setDescription(`Number of messages you'd like to delete.`)
            ),
    async execute(interaction, Discord, message, Lyuca, sdPrefix, fs, DatabaseArr, msgArr, cmdArr){
        let base, quantity;
        if(interaction){
            base = interaction;
            quantity = parseInt(interaction.options.getString('quantity')) + 1;
            base.reply('...pruning.');

        }else{
            base = message;
            quantity = parseInt(message.content.split(` `).pop()) + 1;
        }
        if(!base.member.permissions.has(PermissionFlagsBits.ManageRoles)){
            return message.reply(`Go suck some mod's cock if you want to mute someone cuz :sparkles: you don't have power :sparkles:`);
        }
        if(quantity > 101){
            quantity = 101;
        }
        base.channel.bulkDelete(quantity).then(() => base.channel.send(`${quantity - 1} message(s) were deleted`));
    }
}