# Attendance-Bot

## Motivation
I play World of Warcraft with a raiding guild runs a giveaway for people who sign in early to reward those who are early to the raid. 
This Discord bot is made to automate that process for the person who runs it.
## Commands
#### Moderator Commands
- !attendstart - Starts the recording of attendance.
- !attendcurrent - Shows the currently recorded users during attendance.
- !attendreminder [#] - Sends a TTS message of how many minutes remaining in attendance.
- !attendstop - Stops the recording of attendance.
- !attendadd [YYYY/MM/DD username] - Adds a user to attendance.
- !attendremove [YYYY/MM/DD username] - Removes a user from attendance.
- !attendautoman - Sets the bot in auto or manual mode and follows those rules.
- !attenddeletemonth [YYYY/MM] - Delete a specific month’s recording of attendance.
- !attenddraw [YYYY/MM] - Draws a random entry winner from a specific month.
- !attendhelp (text) - Displays and summarizes every command. Use argument 'text' to get the non-embed version.
- !attendviewday [YYYY/MM/DD] - Displays every entry for a specific date.
- !attendviewmonth [YYYY/MM] - Displays every entry for a specific month.

#### Any User Commands
- !attendviewcount (showdates) - Tells you how many times you have entered in a month. Use argument 'showdates' to show every date
- !enter - User command to enter in the giveaway during attendance recording.

[arguments] = required.
(arguments) = optional

## Tech/framework used
**Built with**
- Node js
- Javascript
- ES6
- Discord.js
- node-schedule ~~node-cron~~

**Dependency Manager**
- NPM

**Hosting**
- Amazon AWS EC2 (free tier / t2 micro)

## Credits
Thanks to the guild *Once Bitten* for giving me something to be motivated about.

Also thanks to unemployment for giving me lots of time to learn something new.

## License
MIT 

(TL;DR credit me if used and I'm not responsible for problems)
