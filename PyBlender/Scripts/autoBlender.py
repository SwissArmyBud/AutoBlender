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
	sout("")
	sout("")
	sout("Loading song into pyBlender.....")

	# load music into librosa
	#
	y, sr = librosa.load(mp3Path, sr=sampleRate)
	sout("")
	sout("**Loading Finished**")
	sout("")
	time.sleep(1)

	sout("")
	sout("")
	sout("Tempo/Beats Processing Engine")
	sout("--------------")
	sout("")

	# setup librosa functions/processing
	#
	tempo, beats = librosa.beat.beat_track(y=y, sr=sampleRate)
	beatArray = librosa.frames_to_time(beats, sr=sr)

	# sout out some information about what we're working with
	#
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

	# confirm script execution
	#
	sout("")
	sout("**Frame Array Construction Finished**")
	sout("")
	time.sleep(2)

	# script setup and housekeeping for VOLUME PROCESSING
	#
	samplesPerFrame = 2
	frameRate = 24
	sampleRate = int(1000 * frameRate)
	sampleHop = int((sampleRate/frameRate)/samplesPerFrame)
	scaleFactor = 100/80

	sout("")
	sout("")
	sout("Volume Processing Engine")
	sout("--------------")
	sout("")

	# setup librosa functions/processing
	#
	S = librosa.feature.melspectrogram(y=y, sr=sampleRate, n_mels=1, fmax=8000, hop_length = sampleHop)
	librosaMel = librosa.amplitude_to_db(S, ref_power=np.max)

	# sout out some information about what we're working with
	samples = len(librosaMel[0])
	sout("Samples: " + str(samples))

	frames = samples/samplesPerFrame
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
	for q in range(frames):
		tmpArry = []
		for r in range(1):
			tempValue = 0
			for s in range(samplesPerFrame):
				tmpValue = tempValue + ((timeArray[(2*q)+s])[r])
				tmpValue = tmpValue / samplesPerFrame
				tmpArry.append(int(tmpValue))
		frameArray.append(tmpArry)

	np.savetxt("./Website/downloads/" +  socketID + ".vol", frameArray)

	# confirm script execution
	#
	sout("")
	sout("**Frame Array Construction Finished**")
	sout("")
	time.sleep(2)

	# script setup and housekeeping for MEL BINS PROCESSING
	#
	samples = 0
	frames = 0
	samplesPerFrame = 2
	frameRate = 24
	sampleRate = 1000 * frameRate
	sampleHop = int((sampleRate/frameRate)/samplesPerFrame)
	scaleFactor = 100/80
	sout("")
	sout("")
	sout("Mel Spectrogram Processing Engine")
	sout("--------------")

	# setup librosa functions/processing
	#
	Q = librosa.feature.melspectrogram(y=y, sr=sampleRate, n_mels=melBins, fmax=8000, hop_length = sampleHop)
	librosaMel = librosa.amplitude_to_db(Q, ref_power=np.max)

	# sout out some information about what we're working with
	#
	samples = len(librosaMel[0])
	sout("Samples: " + str(samples))
	frames = samples/samplesPerFrame
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
	for q in range(frames):
		tmpArry = []
		for r in range(melBins):
			tempValue = 0
			for s in range(samplesPerFrame):
				tmpValue = tempValue + ((timeArray[(2*q)+s])[r])
			tmpValue = tmpValue / samplesPerFrame
			tmpArry.append(int(tmpValue))
		frameArray.append(tmpArry)

	np.savetxt("./Website/downloads/" +  socketID + ".mel", frameArray)

	# confirm script execution
	#
	sout("")
	sout("**Frame Array Construction Finished**")
	sout("")
	time.sleep(2)

	# setup and housekeeping for CORE PROCESSING
	#
	sout("")
	sout("")
	sout("Scene\\Render Core Fusion Engine")
	sout("--------------")
	sout("")

	scenePath  =  "./PyBlender/Scripts/SceneSetup.txt"
	corePath   =  "./PyBlender/Scripts/RenderingCores/" + core + ".txt"
	tailPath  =  "./PyBlender/Scripts/SceneTail.txt"
	#TODO - Fix this missing file from project
	scriptPath =  "./Website/downloads/" + socketID + ".brs"

	sout("Scene will be rendered with core:")
	sout(corePath)

	filenames = [scenePath, corePath, tailPath]
	with open(scriptPath, 'w') as outputFile:
		for file in filenames:
			with open(file) as inputFile:
				outputFile.write(inputFile.read().replace(socketID, "%SID%"))

	# confirm script execution
	#
	sout("")
	sout("**Render Script Construction Finished**")
	sout("")
	time.sleep(2)


def sout(input):
	print(input)

def main(args):
	# # script setup and housekeeping
	# #
	# logging.basicConfig(
	# 	filename = "Out.txt",
	# 	level = logging.DEBUG,
	# 	format = '[webPy]: %(message)s'
	# )

	sout("autoBlender PyBlender Service - *Started* @ %s" % time.ctime())
	sout("");
	sout("");
	sout("System:")
	sout("---------------------------")
	sout("Args: " + ', '.join(args))
	sout("CWD: " + os.getcwd())
	sout("")
	socketID = args[3]
	core = args[1]
	melBins = args[2]
	processMusic(socketID, melBins, core)
	sout("")
	sout("")
	sout("")
	sout("")

if __name__ == '__main__':
    main(sys.argv)
