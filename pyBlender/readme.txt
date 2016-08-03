This set of scripts allows a user to produce a Blender animation based on sound files. 
The initial scripts produce some discreet output and Blender then imports this information and uses it to 
drive custom created and animated objects, all programatically. How to run the program:

1. Put whatever song you want to animate into the Media folder
2. Run the SongBlender batch file and tell it what song you want, how many objects 
   you want animated, and the desired quality of the animation (lower = better, 1 is minimum)

THAT'S IT!

Note: Python must have librosa installed, and both Python and Blender must be in the system's PATH.