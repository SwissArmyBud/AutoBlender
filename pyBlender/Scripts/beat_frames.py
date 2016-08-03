import librosa
import numpy as np
import os, sys

# script setup and housekeeping
#
os.chdir('..\\Media\\')
audioPath = sys.argv[1]
frameRate = 24
sampleRate = 1000 * frameRate

print("")
print("")
print("")
print("Tempo/Beats Processing Engine")
print("--------------")
print("")

# setup librosa functions/processing
#
y, sr = librosa.load(audioPath + ".mp3", sr=sampleRate)
tempo, beats = librosa.beat.beat_track(y=y, sr=sampleRate)
beatArray = librosa.frames_to_time(beats, sr=sr)

# print out some information about what we're working with
#
print("Beats: " + str(len(beats)))
print("Tempo: " + str(int(tempo)))

# setup, fill, and save time and frame values for beat info
#
frameArray = []
for i in beatArray:
	i = i * 100
	i = int(i)
	i = float(i)
	i = i / 100
	frameArray.append(int(i*24))

os.chdir('..\\Output\\')
np.savetxt("beat_frames.lfa", frameArray)
os.chdir('..\\')

# confirm script execution
#
print("")
print("**Frame Array Construction Finished**")
print("")

