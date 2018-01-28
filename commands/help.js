exports.run = (client, message, args) => {
  var printHelp =
    '__General Commands__\n' +
    '!attendadd - Adds a user to attendance based on moderator discretion.\n' +
    '!attendautoman - Sets the bot in auto or manual mode and follows those rules.\n' +
    '!attendcurrent - Shows the currently recorded users during attendance.\n' +
    '!attenddeletemonth - Delete a specific month’s recording of attendance.\n' +
    '!attenddraw - Draws a random entry winner from a specific month.\n' +
    '!attendremove - Removes a user from attendance based on moderator discretion.\n' +
    '!enter - User command to enter in the giveaway during attendance recording.\n\n' +
    '__Manual Commands__\n' +
    '!attendstart - Starts the recording of attendance.\n' +
    '!attendstop - Stops the recording of attendance.\n\n' +
    '__Automation Commands__\n' +
    '!attendlength - Set the length of attendance recording time.\n' +
    '!attendtimestart - Set the start time of the attendance.\n' +
    '!attendtimeend - Set the ending time of the attendance.\n';
  if (args[0] === 'text') {
    return message.channel.send(printHelp + '\nMade by Gobluebro');
  } else {
    return message.channel.send({
      embed: {
        color: 3447003,
        description: printHelp,
        title: '__Command List__',
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
