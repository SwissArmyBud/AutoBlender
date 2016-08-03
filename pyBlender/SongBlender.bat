ECHO OFF
CD /D %~dp0
CLS
ECHO.
ECHO.
ECHO Welcome to the SongBlender program!
ECHO.
ECHO.
ECHO When you are ready...
PAUSE
CLS
ECHO.
ECHO.
ECHO Here is a listing of music available in Media:
ECHO.
ECHO.
DIR .\Media
ECHO.
ECHO.
ECHO What song would you like? (no extension)
SET/P song="  ----> "
CLS
ECHO.
ECHO.
ECHO Here is a listing of render cores available:
ECHO.
ECHO.
DIR .\Scripts\RenderingCores
ECHO.
ECHO.
ECHO What core would you like? (no extension)
SET/P core="  ----> "
CLS
ECHO.
ECHO.
ECHO For song %song%.mp3, rendered with core %core%:
ECHO --------------
ECHO.
ECHO.
ECHO How many elements would you like?
SET/P bins="  ----> "
ECHO.
ECHO.
ECHO How many frames to skip between keys?
SET/P frameskip="  ----> "
CLS
CD .\Scripts
CALL python beat_frames.py %song%
CALL python mel_volume.py %song%
CALL python n_bin_mel.py %song% %bins% 
CALL python core_insert.py %core%
ECHO.
ECHO Starting Blender.
ECHO This console now belongs to Blender!
ECHO.
CALL blender empty.blend -P RenderScript.txt %song% %frameskip%
ECHO.
ECHO Blender is finished.
ECHO This is now a system console!
ECHO.
ECHO.
ECHO.
ECHO OK, SongBlender is finished!
ECHO.
ECHO When you are ready to exit...
PAUSE
