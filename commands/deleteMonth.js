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
  var thisMonth = args[0].split('/')[0] + '-' + args[0].split('/')[1];
  fs.unlink('./logs/' + thisMonth + '.txt', function(err) {
    if (err) {
      if (err.code === 'ENOENT') {
        return message.reply(
          'File not found\n' +
            'Make sure format is in YYYY/MM\n' +
            'e.g. !attenddeletemonth YYYY/MM'
        );
      }
    }
    return message.reply(`The attendance for ${args[0]} has been removed.`);
  });
};
