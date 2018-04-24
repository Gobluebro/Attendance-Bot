const util = require('../util.js');
const fs = require('fs');

//remove a user from a specific month
exports.run = (client, message, args) => {
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
            'Make sure you have the correct format\n' +
            'e.g, !attendremove YYYY/MM/DD username'
        );
      }
      throw err;
    }
    fs.readFile('./logs/' + thisMonth + '.txt', 'utf8', function(err, data) {
      if (err) throw err;
      var wholeFile = data.toString();
      var firstPartFile = wholeFile.substring(0, wholeFile.indexOf(thisDate));
      var lastPartFile = wholeFile.substring(
        wholeFile.indexOf(thisDate),
        wholeFile.length
      );
      var currentDayIndex = lastPartFile.indexOf(thisDate);
      var nextDay = parseInt(theDay, 10) + 1;
      var nextDayFull = theYear + '/' + theMonth + '/' + nextDay.toString();
      var nextDayIndex = lastPartFile.indexOf(nextDayFull);
      var wholeDay = '';
      var removeUser = '';
      var combine = '';
      //making sure I don't accidentally delete a user from a differnt date
      if (nextDayIndex === -1) {
        wholeDay = lastPartFile;
        //if user is not found on this date.
        if (wholeDay.indexOf(args[1]) === -1) {
          return message.reply(
            'The user you specified is not found on that date.'
          );
        }
        //remove the user, remove the empty line, combine them together with the stuff before.
        removeUserArr = wholeDay.split('\r\n');
        removeUserArr.splice(removeUserArr.indexOf(args[1]), 1);
        removeUser = removeUserArr.join('\r\n');
        combine = firstPartFile + removeUser;
      } else {
        wholeDay = lastPartFile.substring(currentDayIndex, nextDayIndex - 1);
        //if user is not found on this date.
        if (wholeDay.indexOf(args[1]) === -1) {
          return message.reply(
            'The user you specified is not found on that date.'
          );
        }
        //remove the user and combine them together with the stuff before and after.
        removeUserArr = wholeDay.split('\r\n');
        removeUserArr.splice(removeUserArr.indexOf(args[1]), 1);
        removeUser = removeUserArr.join('\r\n');
        combine =
          firstPartFile +
          removeUser +
          lastPartFile.substring(nextDayIndex, lastPartFile.length);
      }
      fs.writeFile('./logs/' + thisMonth + '.txt', combine, 'utf8', err => {
        if (err) throw err;
        console.log(
          new Date() +
            ` ${args[1]} has been removed from the recording on ${args[0]}`
        );
        return message.reply(
          `${args[1]} has been removed from the recording on ${args[0]}`
        );
      });
    });
    //must close any opens or else an error can throw "too many files open"
    fs.close(fd, err => {
      if (err) throw err;
    });
  });
};
