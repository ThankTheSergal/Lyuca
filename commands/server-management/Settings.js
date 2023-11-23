const { SlashCommandBuilder, PermissionFlagsBits, AttachmentBuilder, EmbedBuilder } = require("discord.js");
const functions = require("../../functions");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('settings')
        .setDescription('Check the current settings for a server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, Discord, message, Lyuca, sdPrefix, fs, DatabaseArr, msgArr, cmdArr)  {
        let serverSettings = DatabaseArr[1];
        let base, author;
        if(interaction){
            base = interaction;
            author = base.user;
        }else{
            base = message;
            author = base.member.user;
        }

        if(!base.member.permissions.has(PermissionFlagsBits.Administrator)){
            let attachment = new AttachmentBuilder('./images/Reactions/yGoodJob.png')
            return base.reply({
                content: `Missing permissions.`,
                files: [attachment]
            });
        }
        let reply = await base.reply(`...Loading.`);
        const filter = (reaction, user) => author.id == user.id; 
        let currentServer = base.guild.id;
        const h = await serverSettings.findOne({ where: { serverid: currentServer } });
        if(!h){
            return base.channel.send(`Server could not be located, try initializing.`);
        }
        let vCh = base.guild.channels.cache.find(c => c.id == h.verificationchannel);
        let sCh = base.guild.channels.cache.find(c => c.id == h.starboardchannel);
        let vR = base.guild.roles.cache.find(r => r.id == h.verificationrole);
        let sEmb = new EmbedBuilder()
            .setAuthor({
                name: `Server Settings`,
                iconURL: Lyuca.user.avatarURL()
            })
            .setDescription(`Settings currently available:

            -> **Verification / Welcome Channel**
            This is the channel that a welcome message will be displayed, or where new members will have to be verified.
            The current channel is set to: ${vCh}
            To edit this, react with: 1️⃣

            -> **Verification Role**
            This is the role which will be given to members upon verification.
            The current role is set to: ${vR}
            To edit this, react with: 2️⃣

            -> **Starboard Channel**
            This is the channel where starboarded(?) messages will be sent.
            The current channel is: ${sCh}
            To edit this, react with: 3️⃣

            -> **Starboard Reaction Emote**
            This is the emote that will trigger a starboarded(?) message.
            The current emote is: ${h.starboardemote}
            To edit this, react with: 4️⃣
            `)
            .setColor(`#8D8DE7`)
            .setFooter({text: `WIP - All of these are completely optional, and are set to NULL by default.`})
        let m = await base.channel.send({ embeds: [sEmb] });
        reply.delete();
        m.react(`1️⃣`).then(() => m.react(`2️⃣`))
        .then(() => m.react(`3️⃣`)).then(() => m.react(`4️⃣`));

        m.awaitReactions({ filter: filter, max: 1, time: 30000, errors:[`time`] })
        .then((collected) => {
            m.delete();
            let emote = collected.first()._emoji.name;
            let argument
            switch(emote){
                case `1️⃣`: argument = `verificationchannel`; break;
                case `2️⃣`: argument = `verificationrole`; break;
                case `3️⃣`: argument = `starboardchannel`; break;
                case `4️⃣`: argument = `starboardemote`; break;
            }
            functions[argument](base, h, author);
        }).catch((e) => { base.channel.send(`Insert joke about you being slow. You're not worth my time to think of something even mildly good.`) });
    },
}