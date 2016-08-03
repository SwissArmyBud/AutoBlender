import os, sys

print("")
print("")
print("")
print("Scene\\Render Core Fusion Engine")
print("--------------")
print("")

scenePath  =  os.getcwd() + "\\SceneSetup.txt"
corePath   =  os.getcwd() + "\\RenderingCores\\" + sys.argv[1] + ".txt"
scriptPath =  os.getcwd() + "\\RenderScript.txt"

print("Scene will be rendered with core:")
print(corePath)

filenames = [scenePath, corePath]
with open(scriptPath, 'w') as outputFile:
    for file in filenames:
        with open(file) as inputFile:
            outputFile.write(inputFile.read())

# confirm script execution
#
print("")
print("**Render Script Construction Finished**")
print("")
