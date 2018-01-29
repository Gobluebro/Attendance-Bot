const fs = require('fs');

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

      var today = new Date();
      var month = today.getMonth() + 1; //january is 0
      var day = today.getDate(); //getday returns the day of the week.
      var year = today.getFullYear(); //gets the 4 digit version
      thisMonth = year + '-' + month;
      thisDay = year + '/' + month + '/' + day;

      fs.readFile('./logs/' + thisMonth + '.txt', 'utf-8', function(err, data) {
        if (err) {
          if (err.code === 'ENOENT') {
            console.log('doesnt exist');
            config.attendanceArray.unshift(thisDay);
          }
        } else {
          console.log('exists');
          var theFile = data.toString();
          if (theFile.indexOf(thisDay) == -1) {
            config.attendanceArray.unshift(thisDay);
          }
        }
      });
      //start the recording
      return message.channel.send(
        'Attendance recording has started. \n' +
          'Please enter the command !enter to have your name recorded for attendance.'
      );
    }
  }
};
