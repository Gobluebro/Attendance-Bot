const util = require('../util.js');
const fs = require('fs');

//remove a user from a specific month
exports.run = (client, messsage, args) => {
  var errorLog = util.checkArguments(args, 2);
  if (errorLog != '') {
    return message.reply(errorLog);
  }
  errorLog = util.checkDate(args, true);
  if (errorLog != '') {
    return message.reply(errorLog);
  }
  var thisMonth = args[0].split('/')[0] + '-' + args[0].split('/')[1];
  fs.open('./logs/' + thisMonth + '.txt', 'r', (err, fd) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return message.reply(
          'That file does not exist.\n' +
            'Make sure you have the correct format\n' +
            'e.g, !attendremove 2017/12/25 username'
        );
      }
      throw err;
    }
    fs.readFile('./logs/' + thisMonth + '.txt', 'utf8', function(err, data) {
      if (err) throw err;
      var wholeFile = data.toString();
      var firstPartFile = wholeFile.substring(0, wholeFile.indexOf(args[0]));
      var lastPartFile = wholeFile.substring(
        wholeFile.indexOf(args[0]),
        wholeFile.length
      );
      var currentDayIndex = lastPartFile.indexOf(args[0]);
      var nextDay = parseInt(args[0].split('/')[2], 10) + 1;
      var nextDayFull = `${args[0].split('/')[0]}/
        ${args[0].split('/')[1]}/
        ${nextDay.toString()}`;
      var nextDayIndex = lastPartFile.indexOf(nextDayFull);
      //making sure I don't accidentally delete a user from a differnt date
      if (nextDayIndex < lastPartFile.indexOf(args[1])) {
        return message.reply(
          'The user you specified is not found on that date.'
        );
      } else {
        //remove the user, remove the empty line, combine them together with the stuff before.
        var removeUser = lastPartFile.replace(args[1], '');
        var combine = firstPartFile + removeUser.replace(/(\r\n|\n|\r)/, '');
        console.log(combine);
        fs.writeFile('./logs/' + thisMonth + '.txt', combine, 'utf8', err => {
          if (err) throw err;
          return message.reply(
            `${args[1]} has been removed from the recording on ${args[0]}`
          );
        });
      }
    });
    //must close any opens or else an error can throw "too many files open"
    fs.close(fd, err => {
      if (err) throw err;
    });
  });
};
