const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const schedule = require('node-schedule');

//Automation
client.on('ready', () => {
  console.log(new Date() + ' bot turned on');
  client.user.setPresence({
    game: {
      name: "Once Bitten raid Battle of Dazar'alor.",
      type: 'WATCHING'
    },
    status: 'online'
  });
  var job = schedule.scheduleJob('0,5,45 20-21 * * 2-4', function() {
    var theDate = new Date();
    if (theDate.getHours() == 20 && theDate.getMinutes() == 45) {
      const timeStartFile = require('./commands/autoStart.js');
      timeStartFile.run(client, config);
    } else if (theDate.getHours() == 21 && theDate.getMinutes() == 0) {
      if (config.isAutomated && !config.warningSent) {
        console.log(new Date() + ' 5 minute automated warning');
        config.warningSent = true;
        return client.channels
          .get(config.giveawayChannel)
          .send('Attendance is ending in 5 minutes', {
            tts: true
          });
      }
    } else if (theDate.getHours() == 21 && theDate.getMinutes() == 5) {
      const timeEndFile = require('./commands/autoEnd.js');
      timeEndFile.run(client, config);
    }
  });
});

client.on('error', err => {
  console.error(err);
  // client.destroy();
  // console.log(new Date() + ' Client Destroyed');
  // client.login(config.token);
  // console.log(new Date() + ' Client Login');
  return client.channels
    .get(config.giveawayChannelTest)
    .send(new Date() + ' Discord disconnected');
});

client.on('message', async message => {
  //only that channel
  if (
    message.channel.id !== config.giveawayChannel &&
    message.channel.id !== config.giveawayChannelTest
  )
    return;
  //don't accept anything from bots
  if (message.author.bot) return;
  //user error handling
  //requires the prefix
  if (!message.content.startsWith(config.prefix)) return;

  const args = message.content
    .slice(config.prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  //Mod only commands
  //if they have modorator permissions allow
  var commandEntered = false;
  if (message.member.roles.some(r => [config.moderatorName].includes(r.name))) {
    switch (command) {
      //general
      case 'attendautoman':
        const autoManFile = require('./commands/autoMan.js');
        autoManFile.run(client, message, config);
        commandEntered = true;
        break;
      case 'attendcurrent':
        const recordCurrentFile = require('./commands/recordCurrent.js');
        recordCurrentFile.run(client, message, config);
        commandEntered = true;
        break;
      case 'attenddeletemonth':
        const deleteMonthFile = require('./commands/deleteMonth.js');
        deleteMonthFile.run(client, message, args);
        commandEntered = true;
        break;
      case 'attendadd':
        const userAddFile = require('./commands/userAdd.js');
        userAddFile.run(client, message, config, args);
        commandEntered = true;
        break;
      case 'attendremove':
        const userRemoveFile = require('./commands/userRemove.js');
        userRemoveFile.run(client, message, args);
        commandEntered = true;
        break;
      case 'attenddraw':
        const drawFile = require('./commands/draw.js');
        drawFile.run(client, message, args);
        commandEntered = true;
        break;
      case 'attendreminder':
        const timeReminderFile = require('./commands/timeReminder.js');
        timeReminderFile.run(client, message, args);
        commandEntered = true;
        break;
      case 'attendviewday':
        const viewDayFile = require('./commands/viewDay.js');
        viewDayFile.run(client, message, args);
        commandEntered = true;
        break;
      case 'attendviewmonth':
        const viewMonthFile = require('./commands/viewMonth.js');
        viewMonthFile.run(client, message, args);
        commandEntered = true;
        break;

      //manual
      case 'attendstart':
        const recordStartFile = require('./commands/recordStart.js');
        recordStartFile.run(client, message, config);
        commandEntered = true;
        break;
      case 'attendstop':
        const recordStopFile = require('./commands/recordStop.js');
        recordStopFile.run(client, message, config);
        commandEntered = true;
        break;
    }
  }

  if (commandEntered == false) {
    switch (command) {
      case 'enter':
        const enterFile = require('./commands/enter.js');
        enterFile.run(client, message, config);
        break;
      case 'attendhelp':
        const helpFile = require('./commands/help.js');
        helpFile.run(client, message, args);
        break;
      case 'attendviewcount':
        const viewCountFile = require('./commands/viewCount.js');
        viewCountFile.run(client, message, args);
        break;
      default:
        return message.reply(
          message +
            ' is not a correct command or you are not permitted to use it.\nUse !attendhelp for a list of commands, retype your command, or contact a GM.'
        );
    }
  }
});
//hide the api key in a separate file so I don't need to upload it to github
client.login(config.token);
