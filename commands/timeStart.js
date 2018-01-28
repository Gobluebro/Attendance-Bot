exports.run = (client, message, fs) => {
  if (config.isAutomated) {
    if (config.isRecording) {
      return message.reply('Attendance Bot is already recording.');
    } else {
      //get the start time
    }
  } else {
    return message.reply(
      `Attendance Bot is currently in manual mode. If you want the attendance bot to start manually please use the command "!attendautoman" to switch.`
    );
  }
};
