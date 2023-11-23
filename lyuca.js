const { Discord, Client, Events, GatewayIntentBits, Collection, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { sdPrefix, sPrefix } = require('./botconfig.json');
const path = require('node:path');
const fs = require("fs");
const express = require('express');
const bodyParser = require('body-parser');
const functions = require("./functions.js");
require('dotenv').config();

const intents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
];

const Lyuca = new Client({
    intents: [intents],
    disableEveryone: true
});

let commandDesc = [];
let commandName = [];
Lyuca.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders){
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles){
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			Lyuca.commands.set(command.data.name, command);
            commandDesc.push(command.description);
            commandName.push(command.name);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}
const cmdArr = [commandName, commandDesc];

const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'user', 'password', {
    host:'localhost',
    dialect:'sqlite',
    logging: false,
    storage: 'database.sqlite'
})
const serverSettings = sequelize.define('serverSettings', {
    serverid: Sequelize.STRING,
    verificationchannel: Sequelize.STRING,
    verificationrole: Sequelize.STRING,
    starboardchannel: Sequelize.STRING,
    starboardemote: Sequelize.STRING,
    imagelogchannel: Sequelize.STRING,
    duplicatelimit: Sequelize.STRING,
});
const lyucaSupportDb = sequelize.define('LyucaSupportDb', {
    uid:{
        type: Sequelize.STRING,
        unique: true,
    },
    uname: Sequelize.STRING,
    cid: Sequelize.STRING
});
const lyucaOverwatch = sequelize.define(`lyucaOverwatch`, {
    uid: Sequelize.STRING,
    sid: Sequelize.STRING,
    cid: Sequelize.STRING,
});
const roulette = sequelize.define(`roulette`, {
    uid: Sequelize.STRING,
    sid: Sequelize.STRING,
    rid: Sequelize.STRING(1024),
});
const uLevels = sequelize.define(`uLevels`, {
    gid: Sequelize.STRING,
    uid: Sequelize.STRING,
    level: Sequelize.INTEGER,
    xpTotal: Sequelize.INTEGER,
    xpCurrent: Sequelize.INTEGER,
    xpToNextLevel: Sequelize.INTEGER,
    lastUpdateTime: Sequelize.INTEGER,
});
const gLevels = sequelize.define(`gLevels`, {
    uid: Sequelize.STRING,
    level: Sequelize.INTEGER,
    xpTotal: Sequelize.INTEGER,
    xpCurrent: Sequelize.INTEGER,
    xpToNextLevel: Sequelize.INTEGER,
    lastUpdateTime: Sequelize.INTEGER,
});
const sLevels = sequelize.define(`sLevels`, {
    gid: Sequelize.STRING,
    stuff: Sequelize.TEXT,
});
const nwordCount = sequelize.define('nwordCount',{
    uid:            Sequelize.STRING,
    nwordTotal:     Sequelize.INTEGER,
    nwordHardR:     Sequelize.INTEGER,
    nwordSoftR:     Sequelize.INTEGER,
});
const iamDb = sequelize.define('iamDb', {
    uid:            Sequelize.STRING,
    response:       Sequelize.STRING,
});
const penaltyDb = sequelize.define('penaltyDb',{
    //clo is short for Channel Lock Out
    uid:            Sequelize.STRING,
    gid:            Sequelize.STRING,
    strikes:        Sequelize.INTEGER,
    banTime:        Sequelize.INTEGER,
    unbanTime:      Sequelize.INTEGER,
    muteTime:       Sequelize.INTEGER,
    unmuteTime:     Sequelize.INTEGER,
    clo:            Sequelize.INTEGER,
    cloTimeout:     Sequelize.INTEGER,
})
const lyucaPingData = sequelize.define('lyucaPingData', {
    count:          Sequelize.INTEGER,
    pos:            Sequelize.INTEGER,
    isExist:        Sequelize.BOOLEAN,
})
const boostRoleData = sequelize.define('boostRoleData', {
    gid:    Sequelize.STRING,
    uid:    Sequelize.STRING,
    rid:    Sequelize.STRING,
    rname:  Sequelize.STRING,
})               
const patchNoteData = sequelize.define('patchNoteData', {
    version: {
        type: Sequelize.STRING,
        unique: true,
    },
    data:    Sequelize.STRING,   
})
                  //0              1               2               3         4        5        6        7           8      9          10             11             12
let DatabaseArr = [lyucaSupportDb, serverSettings, lyucaOverwatch, roulette, uLevels, gLevels, sLevels, nwordCount, iamDb, penaltyDb, lyucaPingData, boostRoleData, patchNoteData];

// --------------------------> Above is all static and should not change <-------------------------- //


async function findUser(id){
    try {
        let user = await Lyuca.users.fetch(id);
        if(user){
            return user;
        }
        return null;
    }catch(e){
        console.log(e.message);
        return null;
    }
}

const placeApp = express();

placeApp.use(bodyParser.json());

placeApp.listen(3621, () => {
    console.log(`Lyuca is listening on port 3621.`);
});

placeApp.post(`/`, async (req, res) => {
    console.log(`Incoming:`);
    console.log(req.body);
    let user = null;
    let id = req.body.userId;
    if(req.body.userId){
        user = await findUser(id);
    }
    let x = req.body.x;
    let y = req.body.y;
    let colour = req.body.color;

    let placeChannel = await Lyuca.channels.fetch('698225450232709180');
    if(user){
        functions.CanvasPlace(user, x, y, colour, placeChannel);
        return res.status(200).json({message: 'User found.'});
    }else{
        functions.CanvasPlace(user, x, y, colour, placeChannel);
        return res.status(404).json({error: 'User not found.'});
    }
});

Lyuca.on(Events.ClientReady, async ly => {
    console.log(`Lyuca is online.`);
    // Our leaderboard
    let preTop10;
    setInterval(async () => {
        try{
            let top10 = await functions.GetLocalLevels(Lyuca, uLevels);
            if(top10 == preTop10) return;
            preTop10 = top10;
            let ch = Lyuca.channels.cache.get('836383947512086548');
            let lMessage = await ch.messages.fetch("1025478934252503040");
            let leaderboardEmbed = new EmbedBuilder()
                .setTitle("Top 10 Most Active Users.")
                .setDescription(top10)
                .setColor(`#8d8de7`)
                .setTimestamp(new Date())     
            lMessage.edit({embeds: [leaderboardEmbed]});
            }catch(e){
                console.log(e);
            }
    }, 1000);

    // Testing for removing punishments
    setInterval(async () => {
        let pdb = await penaltyDb.findAll()
        let dataArr = pdb.map(m => m.dataValues)
        for(let i = 0; i < dataArr.length; i++){
            let time = Date.now();
            if(dataArr[i].unmuteTime < time){
                g = dataArr[i].gid;
                u = dataArr[i].uid;
                try{
                    let gtum = Lyuca.guilds.cache.find(gd => gd.id == g);
                    if(!gtum){
                        return console.log(`Guild with ID ${g} not found.`);
                    }
                    let utum = await gtum.members.fetch(u);
                    let rtum = gtum.roles.cache.find(r => r.name == 'LyucaMute');
                    if(!rtum){
                        return console.log(`No mute role found.`);
                    }
                    utum.roles.remove(rtum)
                    penaltyDb.destroy({where: {gid: g, uid: u}}).then(() =>{
                        let username = utum.user.username;
                        let tag = utum.user.tag;
                        console.log(`Time expired for ${username}.\nRemoved from database successfully.`);
                    });
                }catch(e){
                    let errStr = e.toString();
                    if(errStr.match('Unknown Member')){
                        console.log(`Could not find member with ID ${u}, removing from database.`);
                        penaltyDb.destroy({where: {gid: g, uid: u}}).then(() =>{
                            console.log('Error thrown. Removed from database successfully.');
                        });
                    }
                }
            }
        }
    }, 10000);
});

Lyuca.on(Events.InteractionCreate, async interaction => {
	if(!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);
    if(!command){
        console.error(`No command matching ${interaction.commandName} found.`);
        return;
    }
    try{
        await command.execute(interaction, Discord, null, Lyuca, sdPrefix, fs, DatabaseArr, null, cmdArr);
    }catch(e){
        console.error(e);
    }
});

Lyuca.on(Events.MessageCreate, async message => {
    if(message.author.bot && message.author.id != '909978405888475197'){
        return;
    }
    if(!message.author.bot){
        functions.LevelStuff(message, uLevels, gLevels, sLevels);
    }
    const content = message.content.toLocaleLowerCase()
    const msgArr  = content.slice(sdPrefix.length).split(/ +/);
    const command = msgArr.shift();

    let wordTriggerArrAlways = [
        `cum tentacle`,
        `cake`,
        `TODAY FUCKING SUCKS`,
        `HELL IS FULL`,
        `seto.mov`,
        `komondor.mp4`,
        `ethy.mov`,
        `spathens.mov`,
        `kita.png`,
        `sharp.mp4`,
        `aero.mp4`,
        `corvettes.mov`,
        `heli.mp4`
    ];
    let replyArrAlways = [
        `https://cdn.discordapp.com/attachments/643844726419750925/810614469373853756/Untitled.mov`,
        `https://tenor.com/view/the-guy-spy-kids-spy-kids3-spy-kids-gameover-spy-kids3d-gif-20854189`,
        `https://cdn.discordapp.com/attachments/643844726419750925/882811629681643520/today_fucking_sucks.png`,
        `https://cdn.discordapp.com/attachments/643844726419750925/1069882575616737280/hell_is_full.png`,
        `https://cdn.discordapp.com/attachments/639706647434100739/848760590075035675/seto.mov`,
        `https://cdn.discordapp.com/attachments/639706647434100739/974547588919472188/final_627c617909d99f007021c583_887966.mp4`,
        `https://cdn.discordapp.com/attachments/974822450498002947/1059327886487728228/math.mov`,
        `https://cdn.discordapp.com/attachments/997730996642394183/1055487236235350106/video.mov`,
        `https://cdn.discordapp.com/attachments/643844726419750925/1060793001015783544/boobs.png`,
        `https://cdn.discordapp.com/attachments/638487217001594937/1061161922558447616/sharp.mp4`,
        `https://cdn.discordapp.com/attachments/643844726419750925/1100591082305228870/aero.mp4`,
        `https://cdn.discordapp.com/attachments/1100608572917809266/1159025751560044584/Steppies.mov`,
        `https://cdn.discordapp.com/attachments/643844726419750925/1171967461017538742/deer_fling.mp4?`
    ];
    let index = wordTriggerArrAlways.indexOf(message.content);
    if(index != -1){
        return message.channel.send(replyArrAlways[index]);
    }

    let wordTriggerArrChance = [
        `gay`,
        `nigga`,
    ];
    let replyArrChance = [
        `Imagine, homosexuality lmao.`,
        `You can't say that, that's racist.`,
    ];
    if(content.startsWith(`${sdPrefix}`)){
        if(!Lyuca.commands.has(command)) return;
        try{
            Lyuca.commands.get(command).execute(null, Discord, message, Lyuca, sdPrefix, fs, DatabaseArr, msgArr, cmdArr) 
        }catch(e){
            console.log(e);
            message.reply(`# YOU FUCKED UP\n(${e.message})`);
        }
    }
    if(message.content.toLowerCase().match('nigga') || message.content.toLowerCase().match('nigger')){
        functions.NwordCount(message, DatabaseArr); //N-Word Counter.
    }
    if (message.mentions.has(Lyuca.user)){
        let pingTable = await lyucaPingData.findOne({where: {isExist: 1}})
        if(!pingTable){
            pingTable = await lyucaPingData.create({
                count:   1,
                pos:     0,
                isExist: 1,
            });
        }else{
            let c = pingTable.dataValues.count + 1;
            pingTable.update({count: c});
        }
        functions.LyucaPing(message, pingTable);
    }
});

Lyuca.on('messageReactionAdd', async (reaction) => {
    functions.starboardAdd(EmbedBuilder, reaction, Lyuca, serverSettings);
});


Lyuca.on('guildMemberAdd', async (member) => {
    if (member.guild.id == `974822450498002944`) {
        functions.EmporiumJoin(member, Discord, serverSettings, Lyuca)
    };
    let failRoleArr = [];
    let savedRoles = await roulette.findOne({ where: {uid: member.id, sid: member.guild.id} })
    if(savedRoles){
        let roleArr = savedRoles.rid.split(`,`);
        let waste   = roleArr.pop();
        for(i = 0; i < roleArr.length; i++){
            let role = member.guild.roles.cache.find(r => r.id == roleArr[i])
            if(role){
                member.roles.add(role).catch(e => console.log(e));
            }
            else{
                failRoleArr.push();
            };
        };
    };
    if(failRoleArr.length > 0){
        console.log(failRoleArr);
    };
});
Lyuca.on('guildMemberRemove', async (member) => {
    if(member.guild.id == `974822450498002944`){
        let h = await member.guild.channels.fetch(`974822450498002947`);
        h.send(`${member.user.tag} has left.`);
    };
});
process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

Lyuca.login(process.env.TOKEN);