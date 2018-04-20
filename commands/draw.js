const util = require('../util.js');
const fs = require('fs');

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
  var theMonth = parseInt(args[0].split('/')[1]).toString();
  var thisMonth = theYear + '-' + theMonth;
  fs.open('./logs/' + thisMonth + '.txt', 'r', (err, fd) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return message.reply(
          'That file does not exist.\n' +
            'Make sure you have the correct format e.g, !attenddraw YYYY/MM/DD'
        );
      }
      throw err;
    }
    fs.readFile('./logs/' + thisMonth + '.txt', 'utf8', function(err, data) {
      if (err) throw err;
      var theUsers = [];
      var wholeFile = data.toString().split('\r\n');
      for (var i = 0; i < wholeFile.length; i++) {
        if (wholeFile[i].includes('/')) {
          continue;
        } else {
          theUsers.push(wholeFile[i]);
        }
      }
      //this needs to be inside the readfile or else it will be a blank array
      return message.channel.send(
        ':tada: The winner for the month of ' +
          args[0] +
          ' is ' +
          util.drawWinner(theUsers) +
          ' :confetti_ball:'
      );
    });
    //must close any opens or else an error can throw "too many files open"
    fs.close(fd, err => {
      if (err) throw err;
    });
  });
};
