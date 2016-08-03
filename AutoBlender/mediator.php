<?php 

$descriptorspec = array(
   0 => array("pipe", "r"),  // stdin
   1 => array("file", "Out.txt", "a"),  // stdout
   2 => array("file", "Err.txt", "a") // stderr
);

$core = $argv[1];
$mels = $argv[2];

//* PYTHON FUNCTION
$process = proc_open("python .\pyBlender\Scripts\autoBlender.py ". $core . " " . $mels, $descriptorspec, $pipes);
$status = proc_get_status($process);
while($status['running']==true){
	sleep(1);
	$status = proc_get_status($process);
}
proc_close($process);
//*/

//* BLENDER FUNCTION
$process = proc_open("blender -b \pyBlender\Scripts\empty.blend --python \pyBlender\Output\RenderScript.txt -o \pyBlender\Output\Blender.blend -- 1"
								, $descriptorspec, $pipes);
$status = proc_get_status($process);
while($status['running']==true){
	sleep(1);
	$status = proc_get_status($process);
}
proc_close($process);
//*/

// WAITING FOR CLEANUP COMMAND OR TIMEOUT
$timer = 0;
while(true){
	sleep(1);
	$timer = $timer + 1;
	$timeout = false;
	if($timer>60){
		$timeout = true;
	}
	if(file_exists("terminate")||$timeout){
		unlink("in_use");
		unlink("pyBlender\Output\beat_frames.lfa");
		unlink("pyBlender\Output\Final.blend");
		unlink("pyBlender\Output\mel_volume.lfa");
		unlink("pyBlender\Output\\n_bin_mel.lfa");
		unlink("pyBlender\Output\RenderScript.txt");
		unlink("pyBlender\Output\userMusic.mp3");
		$file = fopen("Out.txt", "a");
		fwrite($file, "Script reset for next use.");
		fclose($file);
		sleep(5);
		system('taskkill /f /im blender.exe');
		system('taskkill /f /im php.exe');
	}
}

?>