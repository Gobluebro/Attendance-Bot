const Discord = require('discord.js')
const client = new Discord.Client();
const config = require("./config.json");
const fs = require('fs');

function saveAttendance(attendanceArr){
    //make sure there is something in the array
    //and make sure it's not null or undefined
    if (attendanceArr[0] != null){
        var today = new Date();
        var month = today.getMonth()+1; //january is 0
        var day = today.getDate(); //getday returns the day of the week.
        var year = today.getFullYear(); //gets the 4 digit version
        thisMonth = year + '-' + month;
        thisDay = year + '/' +  month + '/' + day;
        attendanceArr.unshift(thisDay);

        //w -open file for writing. the file is created (if it does not exist) or truncated (if it exists).
        //wx - like w but fails if path exists.
        fs.open('./logs/' + thisMonth + '.txt', 'wx', (err, fd) =>{
            if (err){
                //if the file exists already append the array to it
                if(err.code === 'EEXIST'){
                    //flags a means append
                    var appendExistingStream = fs.createWriteStream('./logs/' + thisMonth + '.txt', {flags:'a'});
                    for (var i = 0; i < attendanceArr.length; i++){
                        appendExistingStream.write(attendanceArr[i] + '\n');
                    }
                    appendExistingStream.end();
                    return;
                }
                throw err;
                return;
            }
            //defaults to just writing not appending.
            var newFileStream = fs.createWriteStream('./logs/' + thisMonth + '.txt');
            for (var i = 0; i < attendanceArr.length; i++){
                newFileStream.write(attendanceArr[i] + '\n');
            }
            newFileStream.end();
            return;
        });
    } 
}

// client.on('ready', () => {

// });

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
                var thisMonth = args[0].split('/')[0] + '-' + args[0].split('/')[1];
                fs.unlink('./logs/' + thisMonth + '.txt', function(err){
                    if(err){
                        if(err.code === 'ENOENT'){
                            return message.reply(`File not found
Make sure format is in year/month e.g. "!attenddeletemonth 2017/12".`);
                        }
                    }
                    return message.reply(`The attendance for ${args[0]} has been removed.`);  
                });
                break;
            //#endregion
            //#region attendadd
            case "attendadd":
                //append to the file
                if (config.isRecording){
                    message.reply('Please wait until recording is finished to add someone.');
                } else {
                    var thisMonth = args[0].split('/')[0] + '-' + args[0].split('/')[1];
                    fs.open('./logs/' + thisMonth + '.txt', 'r', (err, fd) =>{
                        if(err){
                            if(err.code === 'ENOENT'){
                                return message.reply(`That file does not exist. 
Make sure you have the correct format e.g, !attendadd 2017/12/25 username`);
                            }
                            throw err;
                        }
                        fs.readFile('./logs/' + thisMonth + '.txt', 'utf8', function(err, data){
                            if (err) throw err;
                            var wholeFile = data.toString();
                            var nextDay = parseInt(args[0].split('/')[2], 10) + 1;
                            var nextDayFull = args[0].split('/')[0] + '/' + args[0].split('/')[1] + '/' + nextDay.toString();
                            var firstPartFile = wholeFile.substring(0, wholeFile.indexOf(nextDayFull) - 1);
                            var lastPartFile = wholeFile.substring(wholeFile.indexOf(nextDayFull), wholeFile.length);
                            var addUser = '\n' + args[1] + '\n';
                            var combine = firstPartFile + addUser + lastPartFile;
                            console.log(combine);
                            fs.writeFile('./logs/' + thisMonth + '.txt', combine, 'utf8', (err) => {
                                    if (err) throw err;
                                    return message.reply(`${args[1]} has been added to the recording on ${args[0]}`);
                            });
                        });
                    });
                }
                break;
            //#endregion
            //#region attendremove
            case "attendremove":
                    //remove from the file
                    var thisMonth = args[0].split('/')[0] + '-' + args[0].split('/')[1];
                    fs.open('./logs/' + thisMonth + '.txt', 'r', (err, fd) =>{
                        if(err){
                            if(err.code === 'ENOENT'){
                                return message.reply(`That file does not exist. 
Make sure you have the correct format e.g, !attendremove 2017/12/25 username`);
                            }
                            throw err;
                        }
                        fs.readFile('./logs/' + thisMonth + '.txt', 'utf8', function(err, data){
                            if (err) throw err;
                            var wholeFile = data.toString();
                            var firstPartFile = wholeFile.substring(0, wholeFile.indexOf(args[0]));
                            var lastPartFile = wholeFile.substring(wholeFile.indexOf(args[0]), wholeFile.length);
                            var currentDayIndex = lastPartFile.indexOf(args[0]);
                            var nextDay = parseInt(args[0].split('/')[2], 10) + 1;
                            var nextDayFull = args[0].split('/')[0] + '/' + args[0].split('/')[1] + '/' + nextDay.toString();
                            var nextDayIndex = lastPartFile.indexOf(nextDayFull);
                            //making sure I don't accidentally delete a user from a differnt date
                            if (nextDayIndex < lastPartFile.indexOf(args[1])){
                                return message.reply('The user you specified is not found on that date.');
                            } else {
                                //remove the user, remove the empty line, combine them together with the stuff before.
                                var removeUser = lastPartFile.replace(args[1], '');
                                var combine = firstPartFile + removeUser.replace(/(\r\n|\n|\r)/, '');
                                console.log(combine);
                                fs.writeFile('./logs/' + thisMonth + '.txt', combine, 'utf8', (err) => {
                                     if (err) throw err;
                                     return message.reply(`${args[1]} has been removed from the recording on ${args[0]}`);
                                });
                            }
                        });
                    });  
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
                        config.attendanceArray = [];
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
                        saveAttendance(config.attendanceArray);
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
    if (command === "entry"){
        if (config.isRecording){
            //only enter their username if they haven't entered today already
            if (config.attendanceArray.includes(message.author.username)){
                return message.reply("You have already entered today.");
            } else {
                //getting their username
                config.attendanceArray.push(message.author.username);
            }
        } else {
            return message.reply(`Attendance bot is not currently recording.
    Please contact a GM for help`);
        }
    }
    //#endregion
});
//hide the api key in a separate file so I don't need to upload it to github
client.login(config.token);