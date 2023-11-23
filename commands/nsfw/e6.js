const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`e6`)
        .setDescription(`Grabs an image from e621.net.`)        
        .addStringOption(option => 
            option.setName('tags')
            .setDescription('tags you wish to add to your search')
        ),
    async execute(interaction, Discord, message, Lyuca, sdPrefix, fs, DatabaseArr, msgArr, cmdArr){
        require('dotenv').config();
        function sendEmbed(winner){
            let payload = new EmbedBuilder()
                .setColor('#8D8DE7')
                .setTitle('Porn! ...maybe?')
                .setDescription(`[Source file](${winner.file.url}) or [e6 page link](https://e621.net/posts/${winner.id})`)
                .setImage(winner.file.url)
            return base.reply({embeds: [payload]});
        }
        let base;
        let options;
        if(interaction){
            base = interaction;
            options = interaction.options.getString('tags');
        }else{
            base = message;
            options = msgArr;
            options = options.join('+');
        }
        if(!base.channel.nsfw){
            let responseArr = [
                "Woah there buck-o. This isn't a *spicy* channel take your hand off your dick for 2 minutes.",
                "You honestly, unironically, disgust me sometimes.",
                "Jesus christ, did you even stop to check if you were in an nsfw channel? Or were you too much of a fucking horndog degenerate to realize you were in a normal channel?",
                "...fuck off.",
                "Oh you want porn? I got a picture for you. Just 1 sec...",
                "You are genuinely embarassing to be around sometimes."
            ]
            let rng = Math.floor(Math.random() * responseArr.length);
            if(rng == 4){
                base.reply(responseArr[rng]);
                let path = './images/RandomResponse/kill yourself.mov'
                let file = new AttachmentBuilder()
                    .setFile(path)
                    .setName('kys.mov')
                return base.channel.send({files: [file]});
            }
            return base.reply(responseArr[rng]);
        }
        let winner;
        let axios = require('axios').default;
        let page = Math.floor(Math.random() * 5) + 1;
        options = options.replace(`:`, `%3A`).replace('/','%2F').replace(' ', '+').replace(/[++]/g, '+');
        let maxAttempts = 0;
        while(true){
            if(maxAttempts > 5){
                break;
            }
            try{
                let blacklist = [
                    'inflation',
                    'hyper',
                    'anal_vore',
                    'my_little_pony',
                    'young',
                    'gore',
                    'scat',
                    'overweight',
                    'judy_hopps',
                    'human',
                ]
                blacklist = blacklist.join("+-");
                let url = `https://e621.net/posts.json?page=${page}&tags=${options}+rating%3Aexplicit+-${blacklist}`;
                const config = {
                    headers: {
                        'authorization': "Basic " + btoa(`ViktorMartin:${process.env.API_KEY}`),
                        'user-agent': 'A bot.'
                    }
                }
                const response = await axios.get(url, config);
                let num = Math.floor(Math.random() * response.data.posts.length);
                console.log("Trying: " + num + " of " + response.data.posts.length + " on page " + page + " at " + url);
                winner = response.data.posts[num];
                if(winner != undefined){
                    break;
                }else{
                    maxAttempts++;
                    page = Math.floor(Math.random() * (page - 1)) + 1;
                    if(page == 0){
                        page = 1;
                    }
                }
            }catch(e){
                console.log(e);
            }
        }
        if(winner){
            sendEmbed(winner);
        }else{
            return base.reply("Sorry, I couldn't find anything with those tags, please check spelling.");
        }
    }
}