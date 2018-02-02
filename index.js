const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

// client.on('ready', () => {

// });

client.on('message', async message => {
  //only that channel
  if (
    message.channel.id !== config.giveawayChannel &&
    message.channel.id !== config.giveawayChannelTest
  )
    return;
  //don't accept anything from the bot
  if (message.author.bot) return;
  //requires the prefix
  if (!message.content.startsWith(config.prefix)) return;

  const args = message.content
    .slice(config.prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  //console.log(args + " " + command);
  //console.log(attendanceArray.toString);
  //console.log(`Config file recording varible is ${config.isAutomated}`);

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
        const timeRemainingReminder = require('./commands/timeRemainingReminder.js');
        timeRemainingReminder.run(client, message, args);
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

      //#region automation
      case 'attendtimestart':
        return message.reply('not working currently');
        //const timeStartFile = require('./commands/timeStart.js');
        //timeStartFile.run(client, message, fs);
        break;
      case 'attendtimeend':
        return message.reply('not working currently');
        //const timeEndFile = require('./commands/timeEnd.js');
        //timeEndFile.run(client, message, fs);
        break;
      case 'attendlength':
        return message.reply('not working currently');
        //const timeLengthFile = require('./commands/timeLength.js');
        //timeLengthFile.run(client, message, fs);
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
