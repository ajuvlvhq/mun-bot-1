//Import all libraries or dependecies
const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true});
var vars = require("./vars.json");
bot.commands = new Discord.Collection();

bot.on("ready", async () => {
  console.log(`\n${bot.user.username} is online!`);
  bot.user.setActivity("-help", {type: "PLAYING"});
})

bot.on("message", async message => {

if(message.author.bot) return;
if(message.channel.type === "dm") return;

let role = message.author.role;
let user = message.author;
var pollactive;

/*Help Command
For those that forgot what the command is*/
if(message.content.toLowerCase().startsWith("-help")){
  message.channel.send(`You've got mail! ${user}`);
  var embed = new Discord.MessageEmbed()
  .setColor('#1C1B1B')
  .setTitle(':ballot_box: MUN Bot Help!')
  .setDescription("MUN Bot Command Help")
  .addField("Commands", "`-voters <n>` : Used to set number of voters `-poll` : Used to create a poll session\n`-vote` : Used to vote when a poll is active\n`-end` : Used to end an active poll session")
  .setFooter('MUN Bot | Made by Jaymz#7815')
  message.author.send(embed);
}

/*Voters Commands*/
if(message.content.toLowerCase().startsWith("-voters") && vars.pollactive == false){
  var arr = message.content.split(" ");
  vars.delegates = arr[1];
  message.delete();
  console.log("Number of delegates set to " + vars.delegates + ".");
  message.channel.send("Number of delegates set to " + vars.delegates + ".");
  }

else if (message.content.toLowerCase().startsWith("-voters") && vars.pollactive == true){
	message.channel.send(":warning: A poll is currently active! Use `-end` to end the poll now!")
}

else if (message.content.toLowerCase().startsWith("-voters") && vars.pollactive == false){
    if(arr[1].toLowerCase() == null){
    message.delete();
    message.channel.send(":warning: Please insert a valid number!")
    return;
    }
}

/*Poll Command
Poll is not rendered "active" until the poll is active.*/
if(message.content.toLowerCase().startsWith("-poll") && vars.pollactive == false && vars.delegates != 0){
  message.delete(); 
  message.channel.send(`:ballot_box: ${user} started a vote! Reply with **-vote yes** / **-vote no** / **-vote abstain**. :ballot_box:` + `\n` + `> ${message.content.toString().slice(6)}`);
  vars.pollactive = true;
}
else if (message.content.toLowerCase().startsWith("-poll") && vars.pollactive == false && vars.delegates == 0){
	message.delete(); 
	message.channel.send(":X: Please set number of voters with `-voters n`")
}

else if (message.content.toLowerCase().startsWith("-poll") && vars.pollactive == true){
	message.delete(); 
	message.channel.send(":warning: A poll is currently active! Use `-end` to end the poll now!")
}

var voted = vars.voted;
if(message.content.toLowerCase().startsWith("-vote") && vars.pollactive == true && vars.votednum < vars.delegates && !voted.includes(message.author)){
  var arrvote = message.content.split(" ");

  //If delegate performed the command "-vote yes", it will move delegate's discord username into the "voted" list/array.
  if(arrvote[1].toLowerCase() == "yes"){
    voted.push(message.author);
    message.delete();
    //Doing so will add 1 to the "Yes" count and total vote count which will be revealed at the end of voting.
    vars.yes++;
    vars.votednum++;
    //As well as to inform everyone, a message will popup in the chat saying that the delegate has voted yes.
    message.channel.send(`:ballot_box: ${user} has voted **Yes**.`);
    return;
    }

  //If delegate performed the command "-vote no", it will move delegate's discord username into the "voted" list/array.
  if(arrvote[1].toLowerCase() == "no"){
    voted.push(message.author);
    message.delete();
    //Doing so will add 1 to the "No" count and total vote count which will be revealed at the end of voting.
    vars.no++;
    vars.votednum = vars.votednum+1 ;
    //As well as to inform everyone, a message will popup in the chat saying that the delegate has voted no.
    message.channel.send(`:ballot_box: ${user} has voted **No**.`);
    return;
    }

  //If delegate performed the command "-vote abstain", it will move delegate's discord username into the "voted" list/array.
  if(arrvote[1].toLowerCase() == "abstain"){
    voted.push(message.author);
    message.delete();
    //Doing so will add 1 to the "Abstain" count and total vote count which will be revealed at the end of voting.
    vars.abstain++;
    vars.votednum++;
      //As well as to inform everyone, a message will popup in the chat saying that the delegate has voted no.
      message.channel.send(`:ballot_box: ${user} has **abstained** from voting.`);
    return;
}}

else if (message.content.toLowerCase().startsWith("-vote") && vars.pollactive == true && vars.votednum <= vars.delegates && voted.includes(message.author)){
	message.delete();
	message.channel.send(`:x: ${user} You have already voted once`);
}

if (message.content.toLowerCase().startsWith("-end") && vars.pollactive == true && vars.votednum == vars.delegates){
	vars.pollactive = false;
	message.delete();
	message.channel.send(":ballot_box: Poll has ended!" + "\n" + "Number of delegates who voted **Yes**: " + vars.yes + "\n" + "Number of delegates who voted **No**: " + vars.no + "\n" + "Number of delegates who **abstained** from voting: " + vars.abstain);
	vars.yes = 0;
	vars.no = 0;	
	vars.abstain = 0;
	vars.delegates = 0;
	vars.votednum = 0;
	vars.voted = [];
}

else if (message.content.toLowerCase().startsWith("-end") && vars.pollactive == false){
	vars.pollactive = false;
	message.delete();
	message.channel.send(`:x: ${user} There is no active poll currently`);
}

let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));
if(!prefixes[message.guild.id]){
    prefixes[message.guild.id] = {
      prefixes: botconfig.prefix
    };
  }

let prefix = prefixes[message.guild.id].prefixes;
let messageArray = message.content.split(" ");
let cmd = messageArray[0];
let args = messageArray.slice(1);
let commandfile = bot.commands.get(cmd.slice(prefix.length));
if(commandfile) commandfile.run(bot,message,args);

})

bot.login(proces.env.BOT_TOKEN);
