exports.checkDate = function(args, isDayIncluded) {
  var yearString = args[0].split('/')[0];
  var monthString = args[0].split('/')[1];

  //checking to make sure they are numbers
  var yearInt = parseInt(yearString);
  var monthInt = parseInt(monthString);

  var errorLog = '';

  if (isDayIncluded) {
    var dayString = args[0].split('/')[2];
    var dayInt = parseInt(dayString);
    if (
      isNaN(yearInt) ||
      isNaN(monthInt) ||
      isNaN(dayInt) ||
      args[0].split('/').length > 3 ||
      yearString.length != 4 ||
      monthString.length < 1 ||
      monthString.length > 2 ||
      dayString.length < 1 ||
      dayString.length > 2
    ) {
      errorLog =
        'The date you entered is not formated correctly \n' +
        'e.g. !commandname YYYY/MM/DD';
      return errorLog;
    }
  } else {
    if (
      isNaN(yearInt) ||
      isNaN(monthInt) ||
      args[0].split('/').length > 2 ||
      yearString.length != 4 ||
      monthString.length < 1 ||
      monthString.length > 2
    ) {
      errorLog =
        'The date you entered is not formated correctly \n' +
        'e.g. !commandname YYYY/MM';
      return errorLog;
    }
  }
  return errorLog;
};

exports.checkArguments = function(args, numberOfArguments) {
  var errorLog = '';
  for (let i = 0; i < numberOfArguments; i++) {
    if (args[i] == undefined) {
      errorLog =
        'The command you entered is missing some information \n' +
        'e.g. !commandname YYYY/MM/DD';
      if (numberOfArguments > 1) {
        errorLog += ' username';
      }
      return errorLog;
    }
  }
  //why even bother checking if they have more arguments if I won't use them
  // //check if too many arguments
  // if (args.length > numberOfArguments) {
  //   errorLog =
  //     `You have too many arguments. There should only be ${numberOfArguments}.\n` +
  //     'e.g. !commandname YYYY/MM/DD';
  //   if (numberOfArguments > 1) {
  //     errorLog += ' username';
  //   }
  //   return errorLog;
  // }
  return errorLog;
};

exports.drawWinner = myArray => {
  var randomNum = Math.floor(Math.random() * myArray.length);
  console.log(
    new Date() +
      `The winning entry number is ${randomNum} - user ${myArray[randomNum]}`
  );
  return myArray[randomNum];
};
