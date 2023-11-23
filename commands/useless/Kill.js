const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kill')
        .setDescription(`Kills a user, clearly, it's in the name.`)
        .addStringOption(option =>
            option.setName('user')
            .setDescription('User you wish to KILL.')
        ),
    async execute(interaction, Discord, message, Lyuca, sdPrefix, fs, DatabaseArr, msgArr, cmdArr){
        let base;
        if(interaction){
            base = interaction;
            target = interaction.options.getString('user');
        }else{
            base = message;
            target = msgArr;
        }
        let ex = require('../../functions');
        victim = await ex.FindMember(base, target);
        if(!victim) return base.reply('You must ping a user to kill');
        let killer = base.member.user.displayName;
        victim = victim.user.displayName;
        if(victim == killer) return base.reply('You comitted suicide');
        let waysToDie = [
            `${victim}: *dodges* \n${killer}: *dies*`,
            `${victim} dueled ${killer} at High Noon.`,
            `${killer} sets a powder keg on ${victim}'s sloop and leaves.`,
            `${killer} pushes ${victim} into lava.`,
            `${killer} Cosby's ${victim}, and kills them in their 'sleep'.`,
            `${victim} was walking to work when ${killer} dropped a piano on them. `,
            `${killer} decided that they don't like ${victim} anymore and shot them in the chest.`,
            `${victim} has been sent to the Backrooms by ${killer}`,
            `${victim} didn't expect ${killer} to actually pull the trigger. \n${killer} did.`,
            `${killer} ripostes ${victim} with a Crystal Greatclub+5.`,
            `${killer} shoots a crossbow at ${victim}, who erupts into blood and vanishes.`,
            `${killer} was acting __***S U S***__, and now ${victim} is dead.`,
            `${killer} steals one of ${victim}'d lungs when they look away.`,
            `${killer} swallows ${victim} whole.`,
            `${victim} suffers a stroke from the sheer awesomeness of ${killer}.`,
            `${killer} hands ${victim} a Hi Point and tells ${victim} to shoot them.`,
            `${killer} stared at ${victim} until they died.`,
        ];
        let godsFate = Math.floor(Math.random() * waysToDie.length);
        if(godsFate == 1){
            let winLose = Math.random();
            if(winLose > 0.5){
                return base.reply(`${waysToDie[godsFate]} ${killer} lost.`)
            }
            else{
                return base.reply(`${waysToDie[godsFate]} ${victim} lost.`)
            }
        }
        return base.reply(waysToDie[godsFate]);
    }
}