const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
module.exports = {
    name: `lv`,
    data: new SlashCommandBuilder()
        .setName('lv')
        .setDescription('Get the current level of you, or a member of this server.'),
    async execute(interaction, Discord, message, Lyuca, sdPrefix, fs, DatabaseArr, msgArr, cmdArr){
        let uLv = DatabaseArr[4];
        let gLv = DatabaseArr[5];
        let mode = msgArr.shift();
        let lbFlag = msgArr.shift();
        let lbnum = msgArr.shift();
        let cLevel, cXp, nXp;
        let base = (interaction) ? interaction : message;
        switch(mode){
            case 'global':
                if(lbFlag == 'top'){
                    try{
                        let topMembers = gLv.findAll({
                            limit: lbnum,
                            order: [['xpTotal', 'DESC']]
                        })
                        let userData = await topMembers.map(d => d.dataValues)
                        let leaderboard = '';
                        let forCap = lbnum;
                        if(lbnum > 10){
                            forCap = 10;
                        }
                        for(let i = 0; i < forCap; i++){
                            let tempMember = await Lyuca.users.fetch(userData[i].uid)
                            leaderboard = leaderboard + `${i+1}) \`${tempMember.username}\`: ${userData[i].xpTotal}\n`;
                        }
                        return message.channel.send(leaderboard)
                    }catch(e){
                        console.log(e);
                    }
                }
                table = await gLv.findOne({where: {uid: message.author.id}});
                cLevel = table.dataValues.level;
                cXp = table.dataValues.xpCurrent;
                nXp = table.dataValues.xpToNextLevel;
                break;
            case 'local':
                if(lbFlag == 'top'){
                    try{
                        let topMembers = await uLv.findAll({
                            where: {gid: message.guild.id},
                            limit: lbnum,
                            order: [['xpTotal', 'DESC']]
                        });
                        let userData = await topMembers.map(d => d.dataValues);
                        let leaderboard = '';
                        let forCap = lbnum;
                        if(lbnum > 10){
                            forCap = 10;
                        }
                        for(let i = 0; i < forCap; i++){
                            let tempMember = await Lyuca.users.fetch(userData[i].uid);
                            let xp = ((x = userData[i].xpTotal) => x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","))();
                            leaderboard += `${i+1}) \`${tempMember.username}\`: ${xp}\n`;
                        }
                        return message.channel.send(leaderboard)
                    }catch(e){
                        console.log(e);
                    }
                }
                table = await uLv.findOne({where: {uid: message.author.id, gid: message.guild.id}});
                cLevel = table.dataValues.level;
                cXp = table.dataValues.xpCurrent;
                nXp = table.dataValues.xpToNextLevel;
                break;
            default:
                return message.channel.send('You must specify the mode. Either \`Local\` or \`Global\`.')    
        }
        let Canvas = require('@napi-rs/canvas');
        let ratio = cXp / nXp;
        const levelBanner = Canvas.createCanvas(1200,300);
        const img = levelBanner.getContext('2d');
        const bg = await Canvas.loadImage(`./images/Levels/levelTemplate.png`);
        let avURL = message.author.avatarURL({extensions: 'png', size: 512});
        const av = await Canvas.loadImage(avURL);
        console.log(cLevel)
        img.drawImage(bg,0,0, levelBanner.width, levelBanner.height);
        img.drawImage(av, 30,30, 242,242);
        img.font = '80px Impact';
        img.fillStyle = '#808080';
        img.lineWidth = 2;
        img.textAlign = 'end';
        img.fillText(cLevel.toString(), 406, 255);
        img.textAlign = 'start';
        img.fillText(`${cLevel + 1}`, 1081, 255);
        img.font = '40px Impact';
        img.textAlign = 'center';
        img.fillText(`${cXp} OF ${nXp} TO NEXT LEVEL`, 745, 290);
        img.fillRect(413, 195, 5, 60);
        img.fillRect(1070, 195, 4, 60);
        img.fillStyle = '#8d8de7';
        img.fillRect(418, 220, ratio * 652 , 7);
        const finalimage = new AttachmentBuilder(await levelBanner.encode('png'), {name: 'level.png'});
        return base.reply({files: [finalimage]});
    }   
}