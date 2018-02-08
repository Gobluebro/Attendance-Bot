const fs = require('fs');

exports.run = (client, config) => {
  // need this because since there is no message
  // there is no way to find the channel to send a message to
  var message = client.channels.find('id', config.giveawayChannel);
  if (!config.isAutomated) {
    return console.log('Attendance Bot is currently in manual mode.');
  } else {
    if (config.isRecording) {
      return console.log('Attendance Bot is already recording.');
    } else {
      console.log('start ' + new Date());
      config.attendanceArray = [];
      config.doubleCheckArray = [];
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
            config.attendanceArray.unshift(thisDay);
          }
        } else {
          var theFile = data.toString();
          if (theFile.indexOf(thisDay) == -1) {
            config.attendanceArray.unshift(thisDay);
          } else if (theFile.indexOf(thisDay) > -1) {
            var wholeFile = data.toString();
            var lastPartFile = wholeFile.substring(
              wholeFile.indexOf(thisDay) + thisDay.length,
              wholeFile.length
            );
            var alreadyRecordedArr = lastPartFile.trim().split('\r\n');
            //ES6 way of push an array into an array
            //https://stackoverflow.com/questions/1374126/how-to-extend-an-existing-javascript-array-with-another-array-without-creating
            config.doubleCheckArray.push(...alreadyRecordedArr);
          }
        }
      });
      //start the recording
      return message.send(
        'Attendance recording has started. \n' +
          'Please enter the command !enter to have your name recorded for attendance.'
      );
    }
  }
};
