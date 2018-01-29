exports.run = (client, message, config) => {
  if (config.isRecording) {
    //only enter their username if they haven't entered today already
    if (
      config.attendanceArray.includes(message.author.username) ||
      config.attendanceArray.includes(message.member.nickname) ||
      config.doubleCheckArray.includes(message.author.username) ||
      config.doubleCheckArray.includes(message.member.nickname)
    ) {
      return message.reply('You have already entered today.');
    } else {
      //prefer getting their nickname otherwise get their username
      if (message.member.nickname == null) {
        config.attendanceArray.push(message.author.username);
      } else {
        config.attendanceArray.push(message.member.nickname);
      }
    }
  } else {
    return message.reply(
      'Attendance bot is not currently recording.\n' +
        'Please contact a GM for help'
    );
  }
};
