const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roulette')
        .setDescription('Selects a random user out of a given list, and kicks them.')
        .addStringOption(option => 
            option.setName('users')
            .setDescription('List of users, must be mentions')),
    async execute(interaction, Discord, message, Lyuca, sdPrefix, fs, DatabaseArr, msgArr, cmdArr){
        const ex = require('../../functions');
        const roles = DatabaseArr[3];
        let base = (interaction) ? interaction : message;
        if(!base.member.permissions.has(PermissionFlagsBits.KickMembers)){
            return base.reply(`Sorry, you lack the permissions to play this game. Now kindly fuck off.`);
        }
        let g = (message) ? message.mentions.users : interaction.options.getString('users');
        if(interaction){
            let tempArray = g.split(' ');
            let userArray = [];
            for(let i = 0; i < tempArray.length; i++){
                let id = tempArray[i].replace(/[<@>]/g, '');
                try{
                    let user = await Lyuca.users.fetch(id);
                    userArray.push(user);
                }catch(e){
                    console.log(`Invalid User at index ${i} of ${g}, continuing.`);
                }
            }
            g = userArray;
        }
        if(g.size < 1){
            return base.channel.send(`Ping someone you dipshit.`);
        }

        let h = g.map(user => user.id);
        h.push(base.member.user.id);
        h = [...new Set(h)];

        let rngesus = Math.floor(Math.random() * h.length);
        let loser   = base.guild.members.cache.find(l => l.id == h[rngesus]);

        base.reply(`${loser.user.globalName || loser.user.username} was shot in the chest after being an idiot with a gun.`);

        let err = await ex.CacheRoles(base, loser, roles);

        if(err){
            return base.channel.send(`${loser.user.globalName || loser.user.username} has been saved by divine intervention, lucky bastard.`);  
        };
        base.guild.invites.fetch().then(async function(invites){
            let invArr = await invites.map(i => i.code)
            let invite; 
            if(!invArr[0]){
                invite = await base.guild.invites.create(base.channel, {
                    temporary: true,
                    maxAge: 1800,
                    maxUses: 1,
                });
                invite = `https://discord.gg/${invite.code}`;
            }else{
                invite = `https://discord.gg/${invArr[0]}`;
            }
            loser.send(invite).then(() => {
                base.channel.send(`${loser.user.globalName || loser.user.username} succumbed to their injuries and bled out.`).then(() => loser.kick());
            });
        });
    }
}