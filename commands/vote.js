//Import all libraries or dependecies
const Discord = require("discord.js");
module.exports.run = async (bot, message, args) => {
	
let role = message.author.role;
let user = message.author;

//Variables needed for voting commands to work
const delegates = 0;
var voted= [];
var yesCount = 0;
var noCount = 0;
var abstainCount = 0;
var votednum = 0;

//Command can only be executed by members with role "Delegate"
// if (message.member.roles.some(role => role.name === 'Staff')) {
if (user.bot) return; 

//A do while loop will make sure everyone has voted in order for the voting to end. 
while (votednum < delegates){
/* Checks if the delegates have voted or not. 
   Their vote will only be counted if they have not been included in the "voted" list/array. 
*/
	if(user != voted) {
		//If delegate performed the command "-vote yes", it will move delegate's discord username into the "voted" list/array.
		if(!args[0]) {
			message.channel.send("Please include your option. E.g : -vote yes")
		}
 		if(args[0].toLowerCase() == "yes"){
 			voted.push(message.member.displayName);
 			message.delete();
			//Doing so will add 1 to the "Yes" count and total vote count which will be revealed at the end of voting.
 			yesCount++;
 			votednum++;
 			//As well as to inform everyone, a message will popup in the chat saying that the delegate has voted yes.
 			message.channel.send(`:ballot_box: ${user} has voted **Yes**.`);
 			return;
		}
		//If delegate performed the command "-vote no", it will move delegate's discord username into the "voted" list/array.
 		if(args[0].toLowerCase() == "no"){
 			voted.push(message.member.displayName);
 			message.delete();
 			//Doing so will add 1 to the "No" count and total vote count which will be revealed at the end of voting.
 			noCount++;
 			votednum++;
 			//As well as to inform everyone, a message will popup in the chat saying that the delegate has voted no.
  			message.channel.send(`:ballot_box: ${user} has voted **No**.`);
 			return;
		}
		//If delegate performed the command "-vote abstain", it will move delegate's discord username into the "voted" list/array.
 		if(args[0].toLowerCase() == "abstain"){
 		voted.push(message.member.displayName);
 		message.delete();
 		//Doing so will add 1 to the "Abstain" count and total vote count which will be revealed at the end of voting.
 		abstainCount++;
 		votednum++;
 	    //As well as to inform everyone, a message will popup in the chat saying that the delegate has voted no.
  		message.channel.send(`:ballot_box: ${user} has **abstained** from voting.`);
 		return;
		}
	}else {
/* If the delegate has already voted, despite of which argument he inputs after "-vote`, it will NOT be counted.
*/
 		if(args[0].toLowerCase() == "yes" || args[0].toLowerCase() == "no" || args[0].toLowerCase() == "abstain"){
 		message.delete();
		message.channel.send(`${user} You already voted!`);
		message.delete(30);
 		return;
		}
	}
	}
    if (votednum == delegates) {
        message.channel.send(yesCount + ` delegate(s) voted **Yes**.` + `\n` + noCount + ` delegate(s) voted **No**.` + `\n` + abstainCount + ` delegate(s) **abstained** from voting.`)
    } 
}
/* To ensure everyone has voted, this whole code block will loop until everyone has voted. */
// }

module.exports.help = {
  name:"vote"
}
