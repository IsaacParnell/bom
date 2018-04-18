

# **Welcome to ShowHost!**

ShowHost runs a game show that includes rounds, scoring, screen display, score display, and hotseat rounds. It is limited to 4 teams only. 


# **How to Use**
## Normal Rounds

The game is controlled by the **host.html** file.
This should be loaded onto a computer in the tech desk.

Each team should have a device in front of them with the **index.html** page loaded.
In front of each team you can also have another device with **teamDisplay.html** loaded (optional)

**screen.html** is displayed on the projectors to show questions, etc to the audience.

**centrestage.html** is used to send messages to the stage without the use of comms, etc. 

## Hotseat

Hotseat rounds are a bit different. 

Setup 2 devices facing away from each other.

One is loaded with **hotseathost.html**: This is where the host will sit and will enter the answers in. 
On the other load **hotseatclient.html**: This is where the contestant will sit and will only display questions and doesn't require interaction.

Note: Other pages such as graph.html and spinner.html **do not** need to be loaded as they are branches of the screen.html and will automatically load when selected by the host.

## Other
I made this in a period where I had just started using jQuery.
Yes I could have made the interface using React but at the time I wasn't too confident
with it and how it worked so I wanted to use a method that I knew how to use and knew worked.

There are a million problems with this but it works sooooo yeah.
If I wrote it again there would be so many changes it wouldn't look the same but hey that's how learning works.
