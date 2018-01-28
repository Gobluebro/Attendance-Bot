exports.run = (client, message, config) => {
  if (config.isRecording) {
    var formattedString =
      'These are the users that have entered during this recording:\n';
    for (let i = 0; i < config.attendanceArray.length; i++) {
      formattedString += config.attendanceArray[i] + '\n';
    }
    return message.channel.send(formattedString);
  } else {
    return message.reply(
      'Attendance Bot is not currently recording.\n' +
        'If you wish to start the recording please use the command "!attendstart" to start.'
    );
  }
};
