exports.run = (client, message, fs) => {
  const minuteLength = parseInt(args[0], 10);
  if (!minuteLength || minuteLength < 1 || minuteLength > 60)
    return message.reply(
      'Please provide a number between 1 and 60 for the length of attendance in minutes.'
    );
};
