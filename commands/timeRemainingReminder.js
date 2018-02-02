exports.run = (client, message, args) => {
  var minutes = parseInt(args[0]);
  var minutesStr = minutes.toString();
  if (isNaN(minutes)) {
    return message.reply(
      'Please enter a number of minutes after the command\n' +
        'e.g. !attendreminder 5'
    );
  } else {
    if (minutes <= 0) {
      return message.reply('Please enter a number greater than 0');
    } else if (minutes == 1) {
      return message.channel.send(
        'Attendance ending in ' + minutesStr + ' minute.',
        {
          tts: true
        }
      );
    } else {
      return message.channel.send(
        'Attendance ending in ' + minutesStr + ' minutes.',
        {
          tts: true
        }
      );
    }
  }
};
