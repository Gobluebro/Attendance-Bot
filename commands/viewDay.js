const util = require('../util.js');
const fs = require('fs');

exports.run = (client, message, args) => {
  var errorLog = util.checkArguments(args, 1);
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
            'Make sure you have the correct format e.g, !attendviewday YYYY/MM/DD'
        );
      }
      throw err;
    }
    fs.readFile('./logs/' + thisMonth + '.txt', 'utf8', function(err, data) {
      if (err) throw err;
      var wholeFile = data.toString();
      if (!wholeFile.includes(thisDate)) {
        return message.reply('This date has no entries.');
      } else {
        var currentDayIndex = wholeFile.indexOf(thisDate);
        // 10 means decimal
        var nextDay = parseInt(theDay, 10) + 1;
        var nextDayFull = theYear + '/' + theMonth + '/' + nextDay.toString();
        var nextDayIndex = wholeFile.indexOf(nextDayFull);
        var dayResults = '';
        if (nextDayIndex > -1) {
          dayResults = wholeFile.substring(currentDayIndex, nextDayIndex);
        } else {
          dayResults = wholeFile.substring(currentDayIndex, wholeFile.length);
        }
        return message.channel.send(dayResults);
      }
    });
    //must close any opens or else an error can throw "too many files open"
    fs.close(fd, err => {
      if (err) throw err;
    });
  });
};
