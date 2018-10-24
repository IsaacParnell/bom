


# **Welcome to ShowHost!**

ShowHost runs a game show that includes rounds, scoring, screen display, score display, and hotseat rounds. It is limited to 4 teams only. 


# **How to Use**
## Normal Rounds

The game is controlled by the **host.html** file.
This should be loaded onto a computer in the tech desk. This should be the only thing you need (no need for ProPresenter, etc).

Each team should have a device in front of them with the **index.html** page loaded.
In front of each team you can also have another device with **teamDisplay.html** loaded facing the crowd. (optional) The teamdisplay page shows the team name, time remaining, and when a questions is marked - the result (correct or incorrect).

**screen.html** is displayed on the projectors to show questions, etc to the audience. Just load this onto chrome or something and drag it onto the projectors and make it fullscreen. There is no need to interact with this page. 

**centrestage.html** is used to send messages to the stage without the use of comms, etc. The message will flash on the screen until it is tapped signifying someone has read it. Make sure people on stage remember to check the centrestage regularly because this was a problem in past years.

## Hotseat
**_Hotseat is very buggy. Use at your own risk._**

Hotseat rounds are a bit different. 

Setup 2 devices facing away from each other.

One is loaded with **hotseathost.html**: This is where the host will sit and will enter the answers in. 
On the other load **hotseatclient.html**: This is where the contestant will sit and will only display questions and doesn't require interaction.

**Make sure the hot seat presenter knows EXACTLY how it works beforehand**

Note: Other pages such as graph.html and spinner.html **do not** need to be loaded as they are branches of the screen.html and will automatically load when selected by the host.

## Customisation
If you wish to use this it will require some knowledge of the following: 

 - Node.Js
 - Socket.io
 - Hosting platforms such as Heroku

**To edit the questions** simply edit **questions.csv** making sure to seperate each question and answer with ,# as if you just use a comma, any questions containing a comma will break. 
This is the same for the hot seat questions stored in **hotseatquestions.csv** except make sure to put the **correct answer first in the list of answers.**

To edit the team names - don't even bother.
Feel free to play with styling, etc. I made it pretty hard coded however as this was only intended to be used once.

## Limitations
It is pretty well set to only use 4 teams. No more no less. You could possibly remove a team from the displays and just ignore it but that is up to you. 

## Footnote
I made this in a period where I had just started using jQuery.
I could have made the interface using React but at the time I wasn't too confident with it and I needed a method that I knew reliably so that if any problems occurred I wouldn't be left looking on stackoverflow for the answer in the middle of the show.

So as it goes with large projects, the codebase is rather complicated, convoluted and messy. If you wish to fork it go ahead.
