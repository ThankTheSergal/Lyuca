const { SlashCommandBuilder } = require(`discord.js`);
const { jar } = require("request");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nboard')
        .setDescription(`Retrieves the nboard`),
    async execute(interaction, Discord, message, Lyuca, sdPrefix, fs, DatabaseArr, msgArr, cmdArr){

        function numberWithCommas(x) {
            let j = x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            return j;
        }

        let base = (interaction) ? interaction : message;
        let basedData = DatabaseArr[7];
        let topBasedPeople = await basedData.findAll({
            limit: 10,
            order: [['nwordTotal', 'DESC']],
        });
        if(topBasedPeople){
            let topCount = topBasedPeople.map(n => n.dataValues);
            let msgFormatArr = [];
            for(i = 0; i < topCount.length; i++){
                let basedUser = await Lyuca.users.fetch(topCount[i].uid);
                let total = numberWithCommas(topCount[i].nwordTotal);
                let hardR = numberWithCommas(topCount[i].nwordHardR);
                let posLine = `${i + 1}) \`${basedUser.username || topCount[i].uName}\`, said the nword **${total}** times. (**${hardR}** times with the hard R)\n`
                msgFormatArr.push(posLine);
            }
            let msg = msgFormatArr.join('');
            base.reply(msg);
        }
    }
}