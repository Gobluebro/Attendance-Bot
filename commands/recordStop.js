const fs = require('fs');

exports.run = (client, message, config) => {
  if (config.isAutomated) {
    return message.reply(
      `Attendance Bot is currently in automation mode. If you wish to start the attendance bot manually please use the command "!attendautoman" to switch.`
    );
  } else {
    if (!config.isRecording) {
      return message.reply(
        'Attendance Bot is not currently recording.\n' +
          'If you wish to start the recording please use the command "!attendstart" to start.'
      );
    } else {
      //stop the recording but not saving it to config
      //if the bot were to die we don't want to save any recordings
      config.isRecording = false;
      //make sure there is something in the array
      //and make sure it's not null or undefined
      if (config.attendanceArray[0] != null) {
        var arrayAttendance = config.attendanceArray;
        var today = new Date();
        var month = today.getMonth() + 1; //january is 0
        var day = today.getDate(); //getday returns the day of the week.
        var year = today.getFullYear(); //gets the 4 digit version
        thisMonth = year + '-' + month;
        thisDay = year + '/' + month + '/' + day;
        //unshift brings the date to the front of the array
        arrayAttendance.unshift(thisDay);

        //w -open file for writing. the file is created (if it does not exist) or truncated (if it exists).
        //wx - like w but fails if path exists.
        fs.open('./logs/' + thisMonth + '.txt', 'wx', (err, fd) => {
          if (err) {
            //if the file exists already append the array to it
            if (err.code === 'EEXIST') {
              //flags a means append
              var appendExistingStream = fs.createWriteStream(
                './logs/' + thisMonth + '.txt',
                { flags: 'a' }
              );
              for (var i = 0; i < arrayAttendance.length; i++) {
                appendExistingStream.write('\r\n' + arrayAttendance[i]);
              }
              appendExistingStream.end();
              return;
            }
            throw err;
            return;
          }
          //defaults to just writing not appending.
          var newFileStream = fs.createWriteStream(
            './logs/' + thisMonth + '.txt'
          );
          newFileStream.write(arrayAttendance[0]);
          if (arrayAttendance[1] != null) {
            for (var i = 1; i < arrayAttendance.length; i++) {
              newFileStream.write('\r\n' + arrayAttendance[i]);
            }
          }
          newFileStream.end();
          return;
          //must close any opens or else an error can throw "too many files open"
          fs.close(fd, err => {
            if (err) throw err;
          });
        });
      }
      return message.channel.send('Attendance has stopped recording.');
    }
  }
};
