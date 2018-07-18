import os
import librosa
import numpy as np
import os, sys
import time
import logging

def processMusic(socketID, melBins, core):

	mp3Path = "./Website/uploads/" + socketID + ".mp3"

	# script setup and housekeeping for BEATS PROCESSING
	#
	melBins = int(melBins)
	frameRate = 24
	sampleRate = 1000 * frameRate

	# load music into librosa
	#
	sout("")
	sout("Loading song into pyBlender.....")
	y, sr = librosa.load(mp3Path, sr=sampleRate)
	sout("**Loading Finished**")
	sout("")

	# setup librosa functions/processing
	#
	sout("")
	sout("")
	sout("Tempo/Beats Processing Engine")
	sout("--------------")
	sout("")
	tempo, beats = librosa.beat.beat_track(y=y, sr=sampleRate)
	beatArray = librosa.frames_to_time(beats, sr=sr)
	sout("**Analysis Finished**")
	sout("Beats: " + str(len(beats)))
	sout("Tempo: " + str(int(tempo)))

	# setup, fill, and save time and frame values for beat info
	#
	frameArray = []
	for i in beatArray:
		i = i * 100
		i = int(i)
		i = float(i)
		i = i / 100
		frameArray.append(int(i*24))

	np.savetxt("./Website/downloads/" +  socketID + ".bts", frameArray)
	sout("**Frame Array Construction Finished**")

	# script setup and housekeeping for VOLUME PROCESSING
	#
	samplesPerFrame = 2
	frameRate = 24
	sampleRate = int(1000 * frameRate)
	sampleHop = int((sampleRate/frameRate)/samplesPerFrame)
	scaleFactor = 100/80

	# setup librosa functions/processing
	#
	sout("")
	sout("")
	sout("Volume Processing Engine")
	sout("--------------")
	sout("")
	S = librosa.feature.melspectrogram(y=y, sr=sampleRate, n_mels=1, fmax=8000, hop_length = sampleHop)
	librosaMel = librosa.amplitude_to_db(S, ref=np.max)

	# sout out some information about what we're working with
	samples = len(librosaMel[0])
	frames = samples/samplesPerFrame
	sout("Samples: " + str(samples))
	sout("Anim. Frames: " + str(frames))
	sout("Samples/Frame: " + str(samplesPerFrame))
	sout("Seconds: " + str(frames/frameRate))

	# convert the bin based Mel spectrogram array to a time based array
	#
	timeArray = []
	for q in range(samples):
		tmpArry = []
		for r in range(1):
			tmpValue = ((librosaMel[r])[q])+80
			tmpArry.append(int(tmpValue*scaleFactor))
		timeArray.append(tmpArry)

	# downconvert the time based array into an animation frame array
	#
	frameArray = []
	for q in range(int(frames)):
		tmpArry = []
		for r in range(1):
			tempValue = 0
			for s in range(samplesPerFrame):
				tmpValue = tempValue + ((timeArray[(2*q)+s])[r])
				tmpValue = tmpValue / samplesPerFrame
				tmpArry.append(int(tmpValue))
		frameArray.append(tmpArry)

	np.savetxt("./Website/downloads/" +  socketID + ".vol", frameArray)
	sout("**Frame Array Construction Finished**")

	# script setup and housekeeping for MEL BINS PROCESSING
	#
	samples = 0
	frames = 0
	samplesPerFrame = 2
	frameRate = 24
	sampleRate = 1000 * frameRate
	sampleHop = int((sampleRate/frameRate)/samplesPerFrame)
	scaleFactor = 100/80

	# setup librosa functions/processing
	#
	sout("")
	sout("")
	sout("Mel Spectrogram Processing Engine")
	sout("--------------")
	sout("")
	Q = librosa.feature.melspectrogram(y=y, sr=sampleRate, n_mels=melBins, fmax=8000, hop_length = sampleHop)
	librosaMel = librosa.amplitude_to_db(Q, ref=np.max)

	# sout out some information about what we're working with
	#
	samples = len(librosaMel[0])
	frames = samples/samplesPerFrame
	sout("Samples: " + str(samples))
	sout("Anim. Frames: " + str(frames))
	sout("Samples/Frame: " + str(samplesPerFrame))
	sout("Seconds: " + str(frames/frameRate))
	sout("Mel Bins: " + str(melBins))

	# convert the bin based Mel spectrogram array to a time based array
	#
	timeArray = []
	for q in range(samples):
		tmpArry = []
		for r in range(melBins):
			tmpValue = ((librosaMel[r])[q])+80
			tmpArry.append(int(tmpValue*scaleFactor))
		timeArray.append(tmpArry)

	# downconvert the time based array into an animation frame array
	#
	frameArray = []
	for q in range(int(frames)):
		tmpArry = []
		for r in range(melBins):
			tempValue = 0
			for s in range(samplesPerFrame):
				tmpValue = tempValue + ((timeArray[(2*q)+s])[r])
			tmpValue = tmpValue / samplesPerFrame
			tmpArry.append(int(tmpValue))
		frameArray.append(tmpArry)

	np.savetxt("./Website/downloads/" +  socketID + ".mel", frameArray)
	sout("**Frame Array Construction Finished**")

	# setup and housekeeping for CORE PROCESSING
	#
	scenePath  =  "./PyBlender/Scripts/SceneSetup.txt"
	corePath   =  "./PyBlender/Scripts/RenderingCores/" + core + ".txt"
	tailPath  =  "./PyBlender/Scripts/SceneTail.txt"
	scriptPath =  "./Website/downloads/" + socketID + ".brs"

	sout("")
	sout("")
	sout("Scene\\Render Core Fusion Engine")
	sout("--------------")
	sout("")
	sout("Scene will be rendered with core:")
	sout(corePath)

	filenames = [scenePath, corePath, tailPath]
	with open(scriptPath, 'w') as outputFile:
		for file in filenames:
			with open(file) as inputFile:
				outputFile.write(inputFile.read().replace(socketID, "%SID%"))
	sout("**Render Script Construction Finished**")


def sout(input):
	print(input)
	time.sleep(.1)

def main(args):
	# # script setup and housekeeping
	# #
	# logging.basicConfig(
	# 	filename = "Out.txt",
	# 	level = logging.DEBUG,
	# 	format = '[webPy]: %(message)s'
	# )

	sout("autoBlender's PyBlender Service - *Started* @ %s" % time.ctime())
	sout("");
	sout("System:")
	sout("---------------------------")
	sout("Args: " + ', '.join(args))
	sout("")
	socketID = args[3]
	core = args[1]
	melBins = args[2]
	processMusic(socketID, melBins, core)

if __name__ == '__main__':
    main(sys.argv)
