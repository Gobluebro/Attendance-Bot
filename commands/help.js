exports.run = (client, message, args) => {
  var printHelp =
    '__Moderator Commands__\n' +
    '!attendstart - Starts the recording of attendance.\n' +
    '!attendcurrent - Shows the currently recorded users during attendance.\n' +
    '!attendreminder [#] - Sends a TTS message of how many minutes remaining in attendance.\n' +
    '!attendstop - Stops the recording of attendance.\n' +
    '!attendadd [YYYY/MM/DD username] - Adds a user to attendance.\n' +
    '!attendremove [YYYY/MM/DD username] - Removes a user from attendance.\n' +
    '!attendautoman - Sets the bot in auto or manual mode and follows those rules.\n' +
    '!attenddeletemonth [YYYY/MM] - Delete a specific month’s recording of attendance.\n' +
    '!attenddraw [YYYY/MM] - Draws a random entry winner from a specific month.\n' +
    '!attendviewday [YYYY/MM/DD] - Displays every entry for a specific date.\n' +
    '!attendviewmonth [YYYY/MM] - Displays every entry for a specific month.\n\n' +
    '__Any User Commands__\n' +
    '!enter - User command to enter in the giveaway during attendance recording.\n\n' +
    '!attendhelp (text) - Displays and summarizes every command.\n' +
    '!attendviewcount (showdates) - Tells you how many times you have entered in a month.\n' +
    '[arguments] = required.\n(arguments) = optional\n';
  if (args[0] === 'text') {
    return message.channel.send(printHelp + '\nMade by Gobluebro');
  } else {
    return message.channel.send({
      embed: {
        color: 3447003,
        description: printHelp,
        title: '__Command List__',
        thumbnail: {
          url:
            'https://raw.githubusercontent.com/Gobluebro/Attendance-Bot/master/images/icon%20used%20for%20discord.jpg'
        },
        author: {
          name: 'Attendance-bot',
          url: 'https://github.com/Gobluebro/Attendance-Bot',
          icon_url: client.user.avatarURL
        },
        footer: {
          text: 'Made by Gobluebro'
        }
      }
    });
  }
};
