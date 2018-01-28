const fs = require('fs');

// this command is to determine if it's on auto or manual and switch it and save it.
exports.run = (client, message, config) => {
  // / root directory, ./ current directory, ../parent of current directory
  //  the config, null, 2 makes it so the json file is not minified/readable
  if (config.isAutomated) {
    config.isAutomated = false;
    fs.writeFile(
      '../config.json',
      JSON.stringify(config, null, 2),
      err => console.error
    );
    return message.reply('Attendance Bot is now in manual mode.');
  } else {
    config.isAutomated = true;
    fs.writeFile(
      '../config.json',
      JSON.stringify(config, null, 2),
      err => console.error
    );
    return message.reply('Attendance Bot is now in automated mode.');
  }
};
