exports.run = (client, message, config) => {
  if (config.isAutomated) {
    return message.reply(
      'Attendance Bot is currently in automation mode. \n' +
        'If you wish to start the attendance bot manually please use the command !attendautoman to switch.'
    );
  } else {
    if (config.isRecording) {
      return message.reply('Attendance Bot is already recording.');
    } else {
      config.attendanceArray = [];
      config.isRecording = true;
      //start the recording
      return message.channel.send(
        'Attendance recording has started. \n' +
          'Please enter the command !enter to have your name recorded for attendance.'
      );
    }
  }
};
