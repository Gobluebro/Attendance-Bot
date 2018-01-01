const Discord = require('discord.js')
const client = new Discord.Client();
const config = require("./config.json");
const fs = require('fs');

//check the date
//open that month's file or create a new one

client.on('ready', () => {
    
});

client.on("message", async message => {
    //only that channel
    if (message.channel.id !== config.giveawayChannel) return;
    //don't accept anything from the bot
    if (message.author.bot) return;
    //requires the prefix
    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    //console.log(args + " " + command);
    //console.log(attendanceArray.toString);
    //console.log(`Config file recording varible is ${config.isAutomated}`);

    //#region Mod only commands
    //if they have modorator permissions allow
    if(message.member.roles.some(r=>[config.moderatorName].includes(r.name))) {
        switch(command){
            //#region general
            //#region attendautoman
            case "attendautoman":
                if (config.isAutomated){
                    config.isAutomated = false;
                    fs.writeFile("./config.json", JSON.stringify(config, null, 2), (err) => console.error);
                    return message.reply(`Attendance Bot is now in manual mode.`);
                } else {
                    config.isAutomated = true;
                    fs.writeFile("./config.json", JSON.stringify(config, null, 2), (err) => console.error);
                    return message.reply(`Attendance Bot is now in automated mode.`);
                }
                break;
            //#endregion
            //#region attenddeletemonth
            case "attenddeletemonth":
                try{
                    message.channel.send(`The attendance for ${args[0]} has been removed.`);
                } catch (e) {
                    message.channel.send(`An Error occurred. Make sure format is in year/month e.g. "!attenddeletemonth 2017/12".`);
                    console.error('There was an error deleting a month!', e);
                }
                break;
            //#endregion
            //#region attendadd
            case "attendadd":
                try{
                    //add to the file
                    message.channel.send(`${args[0]} has been added to the record on ${args[1]}.`);
                } catch (e) {
                    message.channel.send(`An error has occured while trying to add a user to the attendance file.`);
                    console.error('There was an error trying to add to the file!', e);
                }
                break;
            //#endregion
            //#region attendremove
            case "attendremove":
                try{
                    //remove from the file
                    message.channel.send(`${args[0]} has been removed from the recording on ${args[1]}`);
                } catch (e) {
                    message.channel.send(`An error has occured while trying to remove a user to the attendance file.`);
                    console.error('There was an error trying to remove from the file!', e);
                }
                break;
            //#endregion
            //#region attendhelp
            case "attendhelp":
            
                var printHelp = `!entry - User command to enter in the giveaway during attendance recording. 
    !attendautoman - Sets the bot in auto or manual mode and follows those rules. 
    !attenddeletemonth - Delete a specific month’s recording of attendance. 
    !attendadd - Adds a user to attendance based on moderator discretion. 
    !attendremove - Removes a user from attendance based on moderator discretion. 
    !attendstart - Starts the recording of attendance. 
    !attendstop - Stops the recording of attendance. 
    !attendtimestart - Set the start time of the attendance. 
    !attendtimeend - Set the ending time of the attendance. 
    !attendlength - Set the length of attendance recording time.`;
                message.channel.send(printHelp);
                break;
            //#endregion
            //#endregion
    
            //#region manual
            //#region attendstart
            case "attendstart":
                if (config.isAutomated){
                    return message.reply(`Attendance Bot is currently in automation mode. If you wish to start the attendance bot manually please use the command "!attendautoman" to switch.`);
                } else {
                    if (config.isRecording){
                        return message.reply('Attendance Bot is already recording.');
                    } else {
                        config.isRecording = true;
                        //start the recording
                        return message.channel.send(`Attendance recording has started. 
    Please enter the command "!entry" to have your name recorded for attendance.`);
                    }
                }   
                break;
            //#endregion
            //#region attendstop
            case "attendstop":
                if (config.isAutomated) {
                    return message.reply(`Attendance Bot is currently in automation mode. If you wish to start the attendance bot manually please use the command "!attendautoman" to switch.`);
                } else {
                    if (config.isRecording){
                        //stop the recording and save 
                        config.isRecording = false;
                        fs.writeFile("./config.json", JSON.stringify(config, null, 2), (err) => console.error);
                        return message.channel.send(`Attendance has stopped recording.`);
                    } else {
                        return message.reply(`Attendance Bot is not currently recording. If you wish to start the recording please use the command "!attendstart" to start.`);
                    }
                }
                break;
            //#endregion
            //#endregion
    
            //#region automation
    
            //#region attendtimestart
            case "attendtimestart":
                if (config.isAutomated){
                    if (config.isRecording){
                        return message.reply('Attendance Bot is already recording.');
                    } else {
                        //get the start time
                    }
                } else {
                    return message.reply(`Attendance Bot is currently in manual mode. If you want the attendance bot to start manually please use the command "!attendautoman" to switch.`);
                }
                break;
            //#endregion
            //#region attendtimeend
            case "attendtimeend":
                if (config.isAutomated){
                    if (config.isRecording){
                        return message.reply('Attendance Bot is already recording.');
                    } else {
                        //get the end time
                    }
                } else {
                    return message.reply(`Attendance Bot is currently in manual mode. If you want the attendance bot to start manually please use the command "!attendautoman" to switch.`);
                }
                break;
            //#endregion
            //#region attendlength
            case "attendlength":
                const minuteLength = parseInt(args[0], 10);
                if(!minuteLength || minuteLength < 1 || minuteLength > 60)
                    return message.reply("Please provide a number between 1 and 60 for the length of attendance in minutes.");
                break;
            //#endregion
            
            //#endregion
        }
    }
    //#endregion

    //#region All users commands
    if (command === entry){
        if (config.isRecording){
            //only enter their username if they haven't entered today already
            if (config.attendanceArray.includes(message.author.username)){
                //getting their username
                config.attendanceArray.push(message.author.username);
            } else {
                return message.reply("You have already entered today.");
            }
        } else {
            message.channel.send(`Attendance bot is not currently recording.
    Please contact a GM for help`);
        }
    }
    //#endregion
});
//hide the api key in a separate file so I don't need to upload it to github
client.login(config.token);