const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { col } = require('sequelize');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Basic help command.'),
    async execute(interaction, Discord, message, Lyuca, sdPrefix, fs, DatabaseArr, msgArr, cmdArr){
        let base = (interaction) ? interaction : message;
        let reply = await base.reply(`...Loading.`);
        const commandsFolder = fs.readdirSync('./commands');
        let commandsArr = [];
        for(const folder of commandsFolder){
            if(folder == 'special') continue;
            const filePath = './commands/' +  folder;
            const files = fs.readdirSync(filePath).filter(file => file.endsWith('.js'));
            let folderArray = []
            for(const file of files){
                const command = require(`../${folder}/${file}`);
                if('data' in command){
                    folderArray.push({
                        name: command.data.name,
                        description: command.data.description
                    });
                }
            }
            let folderObject = {
                name: folder,
                commands: folderArray,
            }
            commandsArr.push(folderObject);
        }
        let reactionsArray = [
            '1️⃣',
            '2️⃣',
            '3️⃣',
            '4️⃣',
            '5️⃣',
            '6️⃣',
        ];
        let desc = 'Current command categories:\n\n';
        for(let i = 0; i < commandsArr.length; i++){
            let cName = commandsArr[i].name;
            let cLength = commandsArr[i].commands.length;
            cName = cName.charAt(0).toUpperCase() + cName.slice(1, cName.length);
            let singleOrPlural = (cLength > 1) ? 'commands.' : 'command.';
            desc += `**${cName}**  -->  ${cLength} ${singleOrPlural}\nReact with the following to access: ${reactionsArray[i]}\n\n`;
        };

        let ex = require('../../functions');
        let colour = ex.GetColour();
        let helpEmbed = new EmbedBuilder()
            .setTitle('List of Commands')
            .setDescription(desc)
            .setColor(colour)
            .setFooter({text: `Requested by ${base.member.user.globalName || base.member.user.username}`})

        let m = await base.channel.send({embeds: [helpEmbed]});
        reply.delete();
        m.react(`1️⃣`).then(() => m.react(`2️⃣`))
        .then(() => m.react(`3️⃣`)).then(() => m.react(`4️⃣`))
        .then(() => m.react(`5️⃣`)).then(() => m.react(`6️⃣`));

        const filter = (reaction, user) => base.member.user.id == user.id; 
        m.awaitReactions({filter: filter, max: 1, time: 30000, errors:['time']})
        .then(collected => {
            m.delete();
            let emote = collected.first()._emoji.name;
            let argument;
            switch(emote){
                case `1️⃣`: argument = printCommands(0); break;
                case `2️⃣`: argument = printCommands(1); break;
                case `3️⃣`: argument = printCommands(2); break;
                case `4️⃣`: argument = printCommands(3); break;
                case `5️⃣`: argument = printCommands(4); break;
                case `6️⃣`: argument = printCommands(5); break;
                default: return base.channel.send(`React with one of the provided emoji dipshit.`); break;
            }
        })
        async function printCommands(index){
            let name = commandsArr[index].name;
            name = name.charAt(0).toUpperCase() + name.slice(1, name.length);
            let commandDesc = `Current commands in ${name}:\n\n`;
            for(let i = 0; i < commandsArr[index].commands.length; i++){
                let commandName = commandsArr[index].commands[i].name;
                commandName = commandName.charAt(0).toUpperCase() + commandName.slice(1, commandName.length);
                commandDesc += `**${commandName}**:
                ${commandsArr[index].commands[i].description}\n\n`
            }
            let commandsEmbed = new EmbedBuilder()
                .setTitle(`List of Commands`)
                .setColor(colour)
                .setDescription(commandDesc)
                .setThumbnail(base.member.user.avatarURL())
                .setFooter({text: `Requested by ${base.member.user.globalName || base.member.user.username}`})
            return base.channel.send({embeds: [commandsEmbed]});
        }
    }
}