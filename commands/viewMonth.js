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
  var theMonth = args[0].split('/')[1];
  var thisMonth = theYear + '-' + theMonth;
  fs.open('./logs/' + thisMonth + '.txt', 'r', (err, fd) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return message.reply(
          'That file does not exist.\n' +
            'Make sure you have the correct format e.g, !attendviewmonth YYYY/MM/DD'
        );
      }
      throw err;
    }
    fs.readFile('./logs/' + thisMonth + '.txt', 'utf8', function(err, data) {
      if (err) throw err;
      var wholeFile = data.toString();
      wholeFileArray = wholeFile.split('\r\n');
      var formattedFileString = '';
      for (let i = 0; i < wholeFileArray.length; i++) {
        if (wholeFileArray[i].includes('/')) {
          formattedFileString += '**__' + wholeFileArray[i] + '__**\n';
        } else {
          formattedFileString += wholeFileArray[i] + '\n';
        }
      }
      return message.channel.send(formattedFileString);
    });
    //must close any opens or else an error can throw "too many files open"
    fs.close(fd, err => {
      if (err) throw err;
    });
  });
};
