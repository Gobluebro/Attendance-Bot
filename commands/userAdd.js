const util = require('../util.js');
const fs = require('fs');

exports.run = (client, message, config, args) => {
  //append to the file
  if (config.isRecording) {
    return message.reply(
      'Please wait until recording is finished to add someone.'
    );
  } else {
    //I figure doing this instead of try catch is better for performance
    var errorLog = util.checkArguments(args, 2);
    if (errorLog != '') {
      return message.reply(errorLog);
    }
    errorLog = util.checkDate(args, true);
    if (errorLog != '') {
      return message.reply(errorLog);
    }
    var theYear = args[0].split('/')[0];
    var theMonth = parseInt(args[0].split('/')[1]).toString();
    var theDay = parseInt(args[0].split('/')[2]).toString();
    var thisMonth = theYear + '-' + theMonth;
    var thisDate = theYear + '/' + theMonth + '/' + theDay;
    fs.open('./logs/' + thisMonth + '.txt', 'r', (err, fd) => {
      if (err) {
        if (err.code === 'ENOENT') {
          return message.reply(
            'That file does not exist.\n' +
              'Make sure you have the correct format e.g, !attendadd YYYY/MM/DD username'
          );
        }
        throw err;
      }
      fs.readFile('./logs/' + thisMonth + '.txt', 'utf8', function(err, data) {
        if (err) throw err;
        var wholeFile = data.toString();
        var nextDay = parseInt(args[0].split('/')[2], 10) + 1;
        var nextDayFull = theYear + '/' + theMonth + '/' + nextDay.toString();
        if (wholeFile.indexOf(theDay) == -1) {
          return message.reply(args[0] + ' is not recorded yet.');
        } else if (wholeFile.indexOf(nextDayFull) == -1) {
          var addUserToEnd = wholeFile + '\r\n' + args[1];
          fs.writeFile(
            './logs/' + thisMonth + '.txt',
            addUserToEnd,
            'utf8',
            err => {
              if (err) throw err;
              return message.reply(
                `${args[1]} has been added to the recording on ${args[0]}`
              );
            }
          );
        } else {
          var firstPartFile = wholeFile.substring(
            0,
            wholeFile.indexOf(nextDayFull) - 1
          );
          var lastPartFile = wholeFile.substring(
            wholeFile.indexOf(nextDayFull),
            wholeFile.length
          );
          var addUser = '\n' + args[1] + '\r\n';
          var combine = firstPartFile + addUser + lastPartFile;
          fs.writeFile('./logs/' + thisMonth + '.txt', combine, 'utf8', err => {
            if (err) throw err;
            return message.reply(
              `${args[1]} has been added to the recording on ${args[0]}`
            );
          });
        }
      });
      //must close any opens or else an error can throw "too many files open"
      fs.close(fd, err => {
        if (err) throw err;
      });
    });
  }
};
