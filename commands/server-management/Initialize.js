const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('init')
        .setDescription('Initializes the server to default server settings.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    execute(interaction, Discord, message, Lyuca, sdPrefix, fs, DatabaseArr, msgArr, cmdArr) {
        let base;
        if(interaction){
            base = interaction;
        }else{
            base = message;
            if(!base.member.permissions.has(PermissionFlagsBits.Administrator)){
                return message.reply(`You do not have the permissions.`);
            }
        }   
        let serverSettings = DatabaseArr[1];
        base.reply(`Initializing server...`).then(async () => {
            let h = await serverSettings.findOne({where: {serverid: base.guild.id}})
            if(h) return base.channel.send(`Your server has already been initialized.`)
            serverSettings.create({
                    serverid: `${base.guild.id}`,
                    verificationchannel: null,
                    verificationrole: null,
                    starboardchannelid: null,
                    starboardemoteid: null,
                    imagelogchannel: null,
                });
            return base.channel.send(`Your server has been initialized. Use the \`/settings\` or \`ly.settings\` to view / edit.`);                            
        }).catch((e) => {
            console.log(e);
            base.channel.send(`Helpful error message here`);
        });   
    }
};