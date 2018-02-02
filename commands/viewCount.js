const util = require('../util.js');
const fs = require('fs');

//note this doesn't work well if someone changes their username to a nickname
//during the middle of the month
//think about adding IDs to the data saved

exports.run = (client, message, args) => {
  var errorLog = util.checkArguments(args, 1);
  if (errorLog != '') {
    return message.reply(errorLog);
  }
  errorLog = util.checkDate(args, false);
  if (errorLog != '') {
    return message.reply(errorLog);
  }
  var theYear = args[0].split('/')[0];
  var theMonth = args[0].split('/')[1];
  var thisMonth = theYear + '-' + theMonth;
  var theUser = '';
  if (message.member.nickname == null) {
    theUser = message.author.username;
  } else {
    theUser = message.member.nickname;
  }
  fs.open('./logs/' + thisMonth + '.txt', 'r', (err, fd) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return message.reply(
          'That file does not exist.\n' +
            'Make sure you have the correct format e.g, !attendviewcount YYYY/MM'
        );
      }
      throw err;
    }
    fs.readFile('./logs/' + thisMonth + '.txt', 'utf8', function(err, data) {
      if (err) throw err;
      var testDate = '';
      var userEnteredDates = '';
      var userCount = 0;
      var wholeFile = data.toString();
      var wholeFileArr = wholeFile.split('\r\n');
      for (let i = 0; i < wholeFile.length; i++) {
        // need to put this because for loop ends with undefined
        if (wholeFileArr[i] != null) {
          if (wholeFileArr[i].includes('/')) {
            testDate = wholeFileArr[i];
          }
          if (wholeFileArr[i] === theUser) {
            userCount++;
            userEnteredDates += testDate + '\n';
          }
        }
      }
      if (args[1] === 'showdates') {
        return message.reply(
          'You have entered ' +
            userCount +
            ' times during ' +
            args[0] +
            ' on ' +
            '\n' +
            userEnteredDates
        );
      } else {
        return message.reply(
          'You have entered ' + userCount + ' times during ' + args[0]
        );
      }
    });
    //must close any opens or else an error can throw "too many files open"
    fs.close(fd, err => {
      if (err) throw err;
    });
  });
};
