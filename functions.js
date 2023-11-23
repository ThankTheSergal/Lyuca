const { AttachmentBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    GetColour: function () {
        let c1 = Math.floor(Math.random() * 256).toString(16);
            c1 = (c1.length == 1) ? '0' + c1 : c1;
        let c2 = Math.floor(Math.random() * 256).toString(16);
            c2 = (c2.length == 1) ? '0' + c2 : c2;
        let c3 = Math.floor(Math.random() * 256).toString(16);
            c3 = (c3.length == 1) ? '0' + c3 : c3;
        let colour = `#${c1}${c2}${c3}`;
        return colour;
    },
    FindMember: async function (base, target) {
        if(!target) return null;
        let tFinal = target.toString().replace(/,/g,' ');
        if(!tFinal) return null;
        let user;
        let h;
        if(base.mentions){
            h = await base.mentions.members.first();
            if(h){
                return h;
            }
        }
        h = await base.guild.members.fetch();
        user = h.find(m => m.id == tFinal || m.user.username.toLowerCase().startsWith(tFinal));
        if(user){
            return user;
        }

        user = h.find(m => m.user.username.toLowerCase().match(tFinal) || (m.nickname != null && m.nickname.toLowerCase().match(tFinal)));
        if(user){
            return user;
        }

        user = h.find(m => {
            if(!m.user.globalName) return null;
            return m.user.globalName.toLocaleLowerCase().match(tFinal);
        }); 
        if(user){
            return user;
        }

        user = h.find(m => m.id == tFinal.replace(/[<@>]/g,''));
        if(!user){
            return null;
        }
        return user
    },
    NwordCount: async function(message, DatabaseArr){
        let basedData = DatabaseArr[7];
        let countHardR = 0;
        let countSoftR = 0;
        let msgArr = message.content.toLocaleLowerCase().split(' ');
        for(let i = 0; i < msgArr.length; i++){
            if(msgArr[i].match('nigga')){
                countSoftR++;
            }
            if(msgArr[i].match('nigger')){
                countHardR++;
            }
        }
        let basedPerson = await basedData.findOne({where: {uid: message.author.id}})
        if(!basedPerson){
            basedPerson = await basedData.create({
                uid: message.author.id,
                uName: message.author.name,
                nwordTotal: countHardR + countSoftR,
                nwordSoftR: countSoftR,
                nwordHardR: countHardR,
            });
        }
        else if(basedPerson){
                let newCountHardR    = basedPerson.nwordHardR + countHardR;
                let newCountSoftR    = basedPerson.nwordSoftR + countSoftR;
                let total = newCountHardR + newCountSoftR;
                basedPerson.update({nwordHardR: newCountHardR, nwordSoftR: newCountSoftR, nwordTotal: total, uName: message.author.username});
                return;
        }
    },
    decToHexString: function(number) {
        number = +number;
        if(number > 16777215 || number < 1) return null;
        let finalNumber = '';
        let andArr = [0x0000ff, 0x00ff00, 0xff0000];
        for(let i = 0; i < 3; i++){
            let temp = (number & andArr[i]) >> i * 8;
            temp = temp.toString(16);
            temp = (temp.length == 1) ? '0' + temp : temp;
            finalNumber = temp + finalNumber;
        }
        return finalNumber.toUpperCase();
    },
    LyucaPing: async function (message, lyucaPingData){
        let count = lyucaPingData.dataValues.count;
        let pennyCount = count / 100;
        let lPos = lyucaPingData.dataValues.pos;
        let responseArray = [
            "The fuck you want?", //0
            "No, fuck off.",
            "If you ping me one more time I'm going to become racist.",
            "Fuck you.",
            "I will straight up beat you more than your drunk father.",
            "Blocked and reported.", //5 
            "You're the reason I think rape should be legal.",
            "You and your kind disgust me.",
            "Why are you even here?",
            "Do you want my cock in your ass?",
            "https://cdn.discordapp.com/attachments/639706647434100739/700496004163698758/Screenshot_20200323-2115302.png", //10
            "https://cdn.discordapp.com/attachments/683825403114291339/903002646636556309/darkie.png",
            "https://media.discordapp.net/attachments/694791407365390397/816025181062824017/random-typing.gif",
            "https://tenor.com/view/breaking-bad-funny-wtf-wth-jesse-gif-17336046",
            "https://cdn.discordapp.com/attachments/683825403114291339/903002266179600455/kabb.jpeg",
            "You literally kiss your dad on the lips.", //15
            "You are literally homosexual, fuck off.",
            "I'd fuck you, but I don't want HIV.",
            "How fucking lonely are you?",
            "Imagine being so lonely that you have to talk to a fucking bot.",
            "Please, just die. The world would be a better place.", //20
            "Glock or my cock, your choice.",
            "Fuck off, retard.",
            "God, don't you just hate minorities?",
            "Hey everyone, look at this fool. Talking to a fucking bot lmao.",
            "You *may* have the normal number of chromosommes, yet you're still more special than a downy with autism.", //25
            "Insert really racist things.", // Edit this one.
            "https://cdn.discordapp.com/attachments/503461822394007552/709550006448947230/Screenshot_20200510-2204573.png",
            "I love you.",
            "https://cdn.discordapp.com/attachments/503461822394007552/709550458997309480/Screenshot_20200511-154737_Instagram.jpg",
            "Climb back into the bucket of failed abortions you crawled out from", //30
            "https://cdn.discordapp.com/attachments/643844726419750925/726904841376366663/unknown.png",
            "Ok, give me a minute to think about what you just said.", // 32
            "You aren't even worth me coming up with something funny.",
            "ok yes haha i ping bot haha funi",
            "Ok, now let me ask you this. Why do you love cock?", //35 
            "Ok jokes aside, I genuinely hope you lose a close family member in a building fire.",
            "https://cdn.discordapp.com/attachments/698225450232709180/726922286472495134/letterblocks.mp4",
            "https://cdn.discordapp.com/attachments/698225450232709180/726922812610052331/megagay.mp4",
            "https://cdn.discordapp.com/attachments/698225450232709180/726923101778214973/i.mp4",
            "https://cdn.discordapp.com/attachments/698225450232709180/726923441319706635/suck_my_dick.mp4", //40
            "https://cdn.discordapp.com/attachments/698225450232709180/726924969472163870/VHS_Logo_-_YOU_ARE_AMAZING.mp4",
            "https://cdn.discordapp.com/attachments/698225450232709180/726924991534465145/VHS_Logo_-_I_LOVE_YOU.mp4",
            "https://cdn.discordapp.com/attachments/698225450232709180/726925043837435984/VHS_Logo_-_YOURE_INVITED.mp4",
            "https://cdn.discordapp.com/attachments/698225450232709180/726925052997795848/VHS_Logo_-_Im_Begging_You.mp4",
            "Genuinely question why I have to interact with people like you.", //45
            "AHAHAHAHAHAHAAH You're funny. No really I'm fucking wheezing. Retard.",
            "https://cdn.discordapp.com/attachments/478358787783393280/731627077035491437/mega.mp4",
            "https://cdn.discordapp.com/attachments/643844726419750925/878858401831059477/video0.mp4",
            `If I had a fucking penny for every god damn time some retard pinged me I'd have $${pennyCount}.`, //49
            "https://cdn.discordapp.com/attachments/816759790801911899/820821590223618119/fuck_this_server.gif", // 50
            "https://imgur.com/uMNdJjY",
            "https://media.discordapp.net/attachments/755983411369345077/891883118947078155/image0-30.gif",
            "https://media.discordapp.net/attachments/742569473134952509/881934328743989259/image0.gif",
            "https://cdn.discordapp.com/attachments/771112116421787651/911004292956184586/9mrOL3DKRwVIqePyigp9pus6CdV1yJSct7VGcSER0FUtM9fhT1SFfoqM8SMM5iMCy1LUQNzoqgRhJws800-nd.png",
            "https://cdn.discordapp.com/attachments/683825403114291339/934946798877962260/yes.i.am.dailypCYxOnj3I1xs8.mov", // 55
            "https://tenor.com/view/racist-mode-dragon-ball-z-dragon-ball-dragon-ball-super-gif-23959537",
            "https://tenor.com/view/tuga-numeiro-gif-18302117",
            "https://tenor.com/view/stroke-brain-dead-die-dumb-gif-20796254",
            "https://media.discordapp.net/attachments/296056831514509312/762831896861343744/image0.gif",
            "https://imgur.com/I1SH77r", //60
            "https://tenor.com/view/ltg-low-tier-god-you-should-kill-yourself-now-gif-23487049",
            "https://tenor.com/view/omori-tanis-dni-hand-gif-21182886",
            "https://tenor.com/view/dies-of-cringe-cringe-gif-20747133",
            "https://tenor.com/view/shut-up-pfp-shut-up-thing-pfp-anime-pfp-gif-20119426",
            "https://media.discordapp.net/attachments/643844726419750925/803409744836165652/aadhafdahfd.gif",
            "https://cdn.discordapp.com/attachments/638487217001594937/1090874893668724797/kill_yourself.mov"
        ];
        let num = Math.floor(Math.random() * responseArray.length);
        if(num == 10 || lPos > 0){
            let script = [
            "https://cdn.discordapp.com/attachments/639706647434100739/700496004163698758/Screenshot_20200323-2115302.png", //10
            "https://cdn.discordapp.com/attachments/639706647434100739/700496010543104090/received_231333597919932.jpeg",
            "https://cdn.discordapp.com/attachments/639706647434100739/700496071884931142/Screenshot_20200324-1417372.png",
            "https://cdn.discordapp.com/attachments/639706647434100739/700496101865816064/received_218900246159905.jpeg",
            "https://cdn.discordapp.com/attachments/639706647434100739/700496191917391892/received_273339086987932.png",
            ];
            let cPos = lPos;
            let nPos = lPos + 1;
            if(lPos > 3){
                nPos = 0;
            }
            lyucaPingData.update({pos: nPos});
            return message.channel.send(script[cPos]);
        }
        else if (num == 26){
            let editMsg = await message.channel.send(responseArray[num]);
            editMsg.edit(`This message was too violent for Discord.`);
        }
        else if (num == 28){
            let editMsg = await message.channel.send(responseArray[num]);
            let time = Date.now();
            let hahaOops = setInterval(async function () {
                if(time + 1000 < Date.now()){
                    editMsg.edit(`Haha, woops. That was meant for another person. Who are you again?`)
                    clearInterval(hahaOops);
                }
            }, 1000)
        }
        else if (num == 32){
            let editMsg = await message.channel.send(responseArray[num]);
            let time = Date.now();
            let noFucksGiven = setInterval(async function () {
                if(time + 1000 < Date.now()){
                    editMsg.edit(`Ok, after some thought, I've realized I give literal 0 fucks about you and what you have to say.`)
                    clearInterval(noFucksGiven);
                }
            }, 3000)
        }
        else return message.channel.send(responseArray[num]);
    },
    CacheRoles: async function(message, member, roles){
        let lRoles  = member.roles.cache.map(r => r.id);
        let lString = lRoles.toString()
        try{
            let rolesData = await roles.findOne({where: {uid: member.user.id, sid: message.guild.id}});
            if(!rolesData){
                await roles.create({
                    uid: member.id,
                    sid: message.guild.id,
                    rid: lString,
                });
                return false;
            }else{
                await rolesData.update({rid: lString},{where: {uid: member.user.id, sid: message.guild.id}});
                return false;
            };
        }catch(e){
            console.log(e)
            console.log(`Error caching roles.`);
            return true;
        }

    },
    CanvasPlace: async function(user, x, y, colour, pChannel){
        const canvas = require('@napi-rs/canvas');
        const { request } = require('undici')
        const newCanvas = canvas.createCanvas(2560, 1080);
        const img = newCanvas.getContext('2d');
        if(colour){
            loadColour();
        }else{
            img.fillStyle = '#303030';
            img.fillRect(0,0, 2560,1080);
        }
        let username = (user) ? user.globalName || user.username : 'An Anonymous User';
        loadUserText(username);

        await loadUser();

        const finalImage = new AttachmentBuilder(await newCanvas.encode('png'), {name: 'place.png'});
        return pChannel.send({files: [finalImage]});

        function loadColour(){
            img.fillStyle = colour;
            img.fillRect(0,0, 2560,1080);
            img.fillStyle = '#303030';
            img.beginPath();
            img.roundRect(40,40, 2480,1000, [40]);
            img.fill();
        }
        async function loadUser(){
            let av;
            if(user && user!= 'An Anonymous User'){
                const { body } = await request(user.displayAvatarURL({extension: 'png'}));
                av = await canvas.loadImage(await body.arrayBuffer());
            }else{
                av = await canvas.loadImage(`./images/Place/defaultAvatar.png`);
            }
            img.fillStyle = '#252525';
            img.beginPath();
            img.roundRect(120, 120, 840, 840, [60],);
            img.fill();
            img.beginPath();
            img.roundRect(140, 140, 800, 800, [60]);
            img.closePath();
            img.clip();
            img.drawImage(av, 140, 140, 800, 800);
            img.restore();
        }
        function loadUserText(username){
            img.font = '200px Impact';
            img.textAlign = 'center';
            img.fillStyle = colour;

            let fontSize = 400;
            img.font = `400px Impact`;

            while(img.measureText(username).width > newCanvas.width * 0.58){
                img.font = `${fontSize -= 10}px Impact`;
            }
            console.log(fontSize);

            img.fillText(`${username}`, newCanvas.width / 1.475, newCanvas.height / 2.2);
            img.font = '120px Impact';
            img.fillText(`has placed a tile.`, newCanvas.width / 1.5, newCanvas.height / 1.55);
            if(x && y){
                img.fillText(`(${x},${y})`, newCanvas.width / 1.5, newCanvas.height / 1.2);
            }
        }
    },
    EmporiumJoin: async function(member, Discord, serverSettings, Lyuca) {
        let Canvas = require('@napi-rs/canvas')
        let subject = member.user;
        let g = member.guild;
        let e = ``;
        let mc = g.memberCount.toString();
            if(mc.endsWith(`1`)){
                e = `st`
            }
            else if(mc.endsWith(`2`)){
                e = `nd`
            }
            else if(mc.endsWith(`3`)){
                e = `rd`
            }
            else{
                e = `th`
            }
        const cheeseShop = Canvas.createCanvas(3114, 860);
        const ctx = cheeseShop.getContext('2d');
        const background = await Canvas.loadImage(`./images/Emporium/Emporium.png`);
        ctx.drawImage(background, 0, 0, cheeseShop.width, cheeseShop.height);
        ctx.font = `250px Arial`;
        ctx.fillStyle = `#bb8eff`;
        ctx.shadowColor = "#000000";
        ctx.shadowBlur = 40;
        ctx.textAlign = 'center'
        ctx.fillText(`Welcome!`, 1557, 270);
        ctx.font = `150px Arial`;
        ctx.fillText(`${subject.globalName || subject.globalName}`, 1557, 530);
        ctx.fillText(`You are our ${mc}${e} member!`, 1557, 800);
        ctx.fillStyle = `#505050`;
        ctx.fillRect(2510, 70, 532, 532); //Avatar border
        ctx.shadowBlur = 0;
        ctx.fillStyle = `#303030`;
        ctx.fillRect(2520, 80, 512, 512) //Avatar Background
        const loadAvatar = await Canvas.loadImage(subject.avatarURL({format: `png`, size: 512}))
        ctx.drawImage(loadAvatar, 2520, 80, 512, 512)
        ctx.fillStyle = `#8a8bdd`;
        ctx.fillRect(0, 0, cheeseShop.width, 12); //Image border
        ctx.fillRect(0, 0, 20, cheeseShop.height);//Image border
        ctx.fillRect(0, cheeseShop.height - 12, cheeseShop.width, 12);//Image border
        ctx.fillRect(cheeseShop.width - 20, 0, 20, cheeseShop.height);//Image border
        const finalimage = new AttachmentBuilder(await cheeseShop.encode('png'), {name: `WelcomeImage.png`});
        let c = await serverSettings.findOne({where: {serverid: member.guild.id}})
        if(!c){
            return console.log(`h`)
        }
        let WelcomeEmbed = new EmbedBuilder()
            .setDescription(`Welcome to the server ${subject.globalName || subject.globalName}! Enjoy your stay.`)
            .setColor(`#8D8DE7`)
            .setImage(`attachment://WelcomeImage.png`)
        let ch = Lyuca.channels.cache.get('974822450498002947');
        ch.send({
            embeds: [WelcomeEmbed],
            files: [finalimage]
        });
        try{
            let uRole = member.guild.roles.cache.find(r => r.id == `974824677425967244`);
            member.roles.add(uRole);
        }catch(e){
            console.log(e);
            ch.send(`Unable to add user role to ${member}`);
        }
    },
    GetLocalLevels: async function(Lyuca, uLevels){
        try{
            let topMembers = await uLevels.findAll({
                where: {gid: '643844726419750922'},
                limit: 10,
                order: [['xpTotal', 'DESC']]
            });
            let userData = await topMembers.map(d => d.dataValues);
            let leaderboard = '';
            for(let i = 0; i < userData.length; i++){
                if(userData[i]){
                    let tempMember = await Lyuca.users.fetch(userData[i].uid);
                    let xp = ((x = userData[i].xpTotal) => x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","))();
                    leaderboard = leaderboard + `${i+1}) \`${tempMember.username}\`: ${xp}\n`;
                }
            }
            return leaderboard;
        }catch(e){
            console.log(e);
        }
    },
    LevelStuff: async function(message, uLevels, gLevels, sLevels){
        let levelTable = await uLevels.findOne({where: {gid: message.guild.id, uid: message.author.id}})
        let currentTime = Date.now();
        let xpSumResult, xpThresh
        let xpNew = Math.floor(Math.random() * 10) + 5;
        // user was not found
        let localLv = 0;
        if(!levelTable) {
            // create row for this server
            console.log('User was not found, creating profile now.');
            let createdTable = await uLevels.create({
                gid: message.guild.id,
                uid: message.author.id,
                level: 0,
                xpTotal: 0,
                xpCurrent: 0,
                xpToNextLevel: 128,
                lastUpdateTime: currentTime,  
            });
            console.log('Created new row for table \'uLevels\' with the following settings:');
            console.log(createdTable.dataValues);
        }
        //user was found
        else{
            //update row for this server
            let xpCurrentTotal = levelTable.xpTotal;
            if(levelTable.lastUpdateTime + 30000 < currentTime){
                xpSumResult = levelTable.xpCurrent;
                xpSumResult += xpNew;
                xpCurrentTotal += xpNew;
                xpThresh = levelTable.xpToNextLevel;
                if(xpSumResult > xpThresh){
                    //level up
                    xpThresh = Math.floor((xpThresh + 50) * 1.13);
                    let nLevel = levelTable.level;
                        nLevel += 1;
                        levelTable.update({xpCurrent: 0, level: nLevel, xpToNextLevel: xpThresh, lastUpdateTime: currentTime, xpTotal: xpCurrentTotal},{where:{gid: message.guild.id, uid: message.author.id}});
                        const Canvas = require('@napi-rs/canvas');
                        const rankUp = Canvas.createCanvas(1200, 466);
                        const img = rankUp.getContext('2d');
                        const bg = await Canvas.loadImage('./images/Levels/rankUpTemplate.png');
                        const av = await Canvas.loadImage(message.author.avatarURL({format: 'png', size: 256}));
                        img.drawImage(bg, 0, 0, rankUp.width, rankUp.height);
                        img.drawImage(av, 30,30, 242,242);
                        img.font = '200px impact';
                        img.fillStyle = '#FOFOFO';
                        img.textAlign = 'end';
                        img.fillText(nLevel - 1, 620,225);
                        img.textAlign = 'start';
                        img.fillText(nLevel, 850, 225);
                        const finalImage = new AttachmentBuilder(await rankUp.encode('png'), {name:'RankUp.png'});
                        message.channel.send({files: [finalImage]});
                        localLv = 1;
                }
                else{
                    //no level up
                    levelTable.update({xpCurrent: xpSumResult, lastUpdateTime: currentTime, xpTotal: xpCurrentTotal},{where:{gid: message.guild.id, uid: message.author.id}});
                }
            }
        }
        // move to global stuff here    
        let levelTable2 = await gLevels.findOne({where: {uid: message.author.id}});
        if(!levelTable2){
            // user was not found
            // create global profile of user
            levelTable2 = await gLevels.create({
                uid: message.author.id,
                level: 0,
                xpTotal: 0,
                xpCurrent: 0,
                xpToNextLevel: 128,
                lastUpdateTime: currentTime,
            })
            console.log('No user was found. Created row under \'gLevels\' with the following settings.')
            console.log(levelTable2.dataValues);
        }
        else{
        // user was found update global profile
            if(levelTable2.lastUpdateTime + 30000 < currentTime){
                let xpCurrentTotal = levelTable2.xpTotal;
                xpSumResult = levelTable2.xpCurrent;
                xpSumResult += xpNew;
                xpCurrentTotal += xpNew;
                xpThresh = levelTable2.xpToNextLevel;
                if(xpSumResult > xpThresh){
                    xpThresh = Math.floor((xpThresh + 50) * 1.13);
                    let nLevel = levelTable2.level;
                        nLevel += 1;
                        levelTable2.update({xpCurrent: 0, level: nLevel, xpToNextLevel: xpThresh, lastUpdateTime: currentTime, xpTotal: xpCurrentTotal},{where:{uid: message.author.id}});
                        const Canvas = require('@napi-rs/canvas');
                        const rankUp = Canvas.createCanvas(1200, 466);
                        const img = rankUp.getContext('2d');
                        const bg = await Canvas.loadImage('./images/Levels/rankUpTemplate.png');
                        const av = await Canvas.loadImage(message.author.avatarURL({format: 'png', size: 256}));
                        img.drawImage(bg, 0, 0, rankUp.width, rankUp.height);
                        img.drawImage(av, 30,30, 242,242);
                        img.font = '200px impact';
                        img.fillStyle = '#FOFOFO';
                        img.textAlign = 'end';
                        img.fillText(nLevel - 1, 620,225);
                        img.textAlign = 'start';
                        img.fillText(nLevel, 850, 225);
                        const finalImage = new AttachmentBuilder(await rankUp.encode('png'), {name: 'RankUp.png'});
                        if(localLv == 0){
                            message.channel.send({files: [finalImage]});
                        }
                    }
                else{
                    levelTable2.update({xpCurrent: xpSumResult, lastUpdateTime: currentTime, xpTotal: xpCurrentTotal},{where:{uid: message.author.id}});
                }
            }
        }
    },
    starboardAdd: async function (EmbedBuilder, reaction, Lyuca, serverSettings){
        let sbServer = await serverSettings.findOne({where: {serverid: reaction.message.guild.id}})
        if(!sbServer){
            return;
        }
        if(!sbServer.starboardchannel || !sbServer.starboardemote){
            return;
        }
        if(reaction.emoji.id != sbServer.starboardemote){
            return; 
        };

        let description;
        if(reaction.message.content.length > 0){
            description = `The following message was brought to you by ${reaction.message.author}...\n\n"${reaction.message.content}"`;
        }else{
            description = `The following message was brought to you by ${reaction.message.author}.`;
        }
        let pinEmbed = new EmbedBuilder()
            .setAuthor({name: `${reaction.message.author.username}`, URL: reaction.message.author.avatarURL()})
            .setDescription(description)
            .setColor(`#00FFAA`)
            .addFields({name: `**View Context:**`, value: `[Here](https://discordapp.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id})`})
            .setFooter({text: `Sometimes, it just do be like that.`})
            .setTimestamp()
        
        if(reaction.message.attachments.size > 0){
            let h = reaction.message.attachments.first().url;
            pinEmbed.setImage(h)
        }

        Lyuca.channels.cache.get(sbServer.starboardchannel).send({embeds: [pinEmbed]})
        .then(reaction.message.reactions.removeAll())
        .then(reaction.message.channel.send(`Comment has been added to <#${sbServer.starboardchannel}>`));  
    },
    //-------------- Server Settings --------------//
    verificationchannel: async function (base, h, author) {
        const filter = response => response.author.id == author.id;
        base.channel.send(`So you wish to edit the Verification Channel? Alright, please provide the ID of thechannel you want to change it to.`)
        base.channel.awaitMessages({filter: filter, max: 1, time:60000})
        .then(async (cArgument) => {
            let con = cArgument.first().content.replace(/[<#>]/g,``);
            let ch = await base.guild.channels.fetch(con);
            h.update({ verificationchannel:ch.id}, {where: {serverId: base.guild.id}});
            return base.channel.send(`Designated channel has been updated to ${ch}.`);
        }).catch((e) => {
            console.log(e);
            console.log(e.message)
            if(e.message.startsWith('Invalid Form Body')){
                return base.channel.send('Please select the channel by using `#<channel-name>`.')
            }else{
                return base.channel.send('Something went wrong, see the console.');
            }
        });
    },
    verificationrole: async function (base, h, author) {
        const filter = response => response.author.id == author.id;
        base.channel.send(`So you wish to edit Verification Role? Alright, please provide the ID of the role you want to change it to.`)
        base.channel.awaitMessages({filter: filter, max: 1, time:60000})
        .then(async function (cArgument) {
            let con = cArgument.first().content.replace(/[<@&>]/g,``);
            let r = base.guild.roles.cache.find(r => r.id = con);
            h.update({ verificationrole:r.id}, {where: {serverId: base.guild.id}});
            return base.channel.send(`Designated channel has been updated to ${r}.`);
        })
    },
    starboardchannel: async function (base, h, author) {
        const filter = response => response.author.id == author.id;
        base.channel.send(`So you wish to edit Starboard Channel? Alright, please provide the ID of the channel you want to change it to.`)
        base.channel.awaitMessages({filter: filter, max: 1, time:60000})
        .then(async function (cArgument) {
            let con = cArgument.first().content.replace(/[<#>]/g,``);
            let ch = base.guild.channels.cache.find(c => c.id == con);
            h.update({starboardchannel:ch.id}, {where: {serverId: base.guild.id}})
            return base.channel.send(`Designated channel has been updated to ${ch}.`)
        })
    },
    starboardemote: async function (base, h, author) {
        const filter = response => response.author.id == author.id;
        base.channel.send(`So you wish to edit Staboard React Emote? Alright, please use the emote you want to be the reaction emote.`)
        base.channel.awaitMessages({filter: filter, max: 1, time:60000})
        .then(async function (cArgument) {
            let emote = cArgument.first().content;
            let con = emote.split(':');
            con = con[2].replace(/[<>]/g,'');
            h.update({ starboardemote:con}, {where: {serverId: base.guild.id}})
            return base.channel.send(`Starboard reaction emote has been updated to ${emote}`)
        })
    },
}