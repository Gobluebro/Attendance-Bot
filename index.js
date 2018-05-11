const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const schedule = require('node-schedule');

//#region Automation
client.on('ready', () => {
  console.log(new Date() + ' bot turned on');
  //client.user.setGame('');
  var job = schedule.scheduleJob('0,30,35 21 * * 2-4', function() {
    var theDate = new Date();
    if (theDate.getMinutes() == 0) {
      const timeStartFile = require('./commands/autoStart.js');
      timeStartFile.run(client, config);
    } else if (theDate.getMinutes() == 30) {
      if (config.isAutomated) {
        console.log(new Date() + ' 5 minute automated warning');
        return client.channels
          .get(config.giveawayChannel)
          .send('Attendance is ending in 5 minutes', {
            tts: true
          });
      }
    } else if (theDate.getMinutes() == 35) {
      const timeEndFile = require('./commands/autoEnd.js');
      timeEndFile.run(client, config);
    }
  });
});
//#endregion

client.on('error', err => {
  console.error(err);
  client.destroy();
  console.log(new Date() + ' Client Destroyed');
  client.login(config.token);
  console.log(new Date() + ' Client Login');
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
  if (
    config.isRecording == true &&
    (message.content == 'lenter' || message.content == 'Ienter')
  ) {
    return message.reply(
      'You have entered the wrong command. You have not been entered.\nPlease use the !enter (exclaimation point) enter command.'
    );
  }
  //requires the prefix
  if (!message.content.startsWith(config.prefix)) return;

  const args = message.content
    .slice(config.prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  //#region Mod only commands
  //if they have modorator permissions allow
  if (message.member.roles.some(r => [config.moderatorName].includes(r.name))) {
    switch (command) {
      //#region general
      case 'attendautoman':
        const autoManFile = require('./commands/autoMan.js');
        autoManFile.run(client, message, config);
        break;
      //attendview
      case 'attendcurrent':
        const recordCurrentFile = require('./commands/recordCurrent.js');
        recordCurrentFile.run(client, message, config);
        break;
      case 'attenddeletemonth':
        const deleteMonthFile = require('./commands/deleteMonth.js');
        deleteMonthFile.run(client, message, args);
        break;
      case 'attendadd':
        const userAddFile = require('./commands/userAdd.js');
        userAddFile.run(client, message, config, args);
        break;
      case 'attendremove':
        const userRemoveFile = require('./commands/userRemove.js');
        userRemoveFile.run(client, message, args);
        break;
      case 'attendhelp':
        const helpFile = require('./commands/help.js');
        helpFile.run(client, message, args);
        break;
      case 'attenddraw':
        const drawFile = require('./commands/draw.js');
        drawFile.run(client, message, args);
        break;
      case 'attendreminder':
        const timeReminderFile = require('./commands/timeReminder.js');
        timeReminderFile.run(client, message, args);
        break;
      case 'attendviewday':
        const viewDayFile = require('./commands/viewDay.js');
        viewDayFile.run(client, message, args);
        break;
      case 'attendviewmonth':
        const viewMonthFile = require('./commands/viewMonth.js');
        viewMonthFile.run(client, message, args);
        break;
      //#endregion

      //#region manual
      case 'attendstart':
        const recordStartFile = require('./commands/recordStart.js');
        recordStartFile.run(client, message, config);
        break;
      case 'attendstop':
        const recordStopFile = require('./commands/recordStop.js');
        recordStopFile.run(client, message, config);
        break;
      //#endregion
    }
  }
  //#endregion

  //#region All users commands
  switch (command) {
    case 'enter':
      const enterFile = require('./commands/enter.js');
      enterFile.run(client, message, config);
      break;
    case 'attendviewcount':
      const viewCountFile = require('./commands/viewCount.js');
      viewCountFile.run(client, message, args);
      break;
  }
  //#endregion
});
//hide the api key in a separate file so I don't need to upload it to github
client.login(config.token);
