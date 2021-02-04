require('dotenv').config();
const Discord = require('discord.js');
const axios = require('axios')
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;

async function dailyMessage() {
  let endPoint = `http://newsapi.org/v2/top-headlines?category=business&apiKey=${process.env.API_KEY}`

  try {
    const data = axios.get(endPoint)
    return data
  } catch (error) {
    console.log("Error ", error)
  }
}

bot.login(TOKEN);

bot.on('ready', () => {
  var guild = bot.guilds.get(process.env.GUILD_ID);
  if(guild && guild.channels.get(process.env.CHANNEL_ID)){
      
        dailyMessage().then(response => {
          const curatedList = []
          response.data.articles.forEach(element => {
            let randomIndex = Math.random(0, response.data.articles.length)
            if (!(curatedList.includes(response.data.articles.length[randomIndex])) && curatedList.length < 10) {
              curatedList.push(element)
            }
          });
          let message = "```***Todays Top Business Articles Include***\n\n"
          curatedList.forEach(element => {
            message += "  - " + element.title + "\n"
          });
          message += "```"
        guild.channels.get(process.env.CHANNEL_ID).send(message).then(() => {
          console.log("Stonk atricles posted")
        });
    });
  } else {
      console.log("nope");
  }
});

bot.on('message', msg => {
  if (msg.content === '!STONK ') {
    msg.reply('pong');
  }
});
