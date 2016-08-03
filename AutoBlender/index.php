<!DOCTYPE html>
<script type="text/javascript" src="main.js"></script>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<title>autoBlender v2.0</title>
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta name="Description" lang="en" content="ADD SITE DESCRIPTION">
		<meta name="author" content="ADD AUTHOR INFORMATION">
		<meta name="robots" content="index, follow">

		<!-- icons -->
		<link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png">
		<link rel="shortcut icon" href="favicon.ico">

		<!-- Override CSS file - add your own CSS rules -->
		<link rel="stylesheet" href="assets/css/styles.css">
	</head>
	
	<body>
		<div class="fixed-nav-bar">
			<table><tr><th><div class="header">
				<h1 class="header-heading">autoBlender</h1></div></th>
				
					<th><li><a href="#homeRef">Home</a></li></th>
					<th><li><a href="#consoleRef">Console</a></li></th>
					<th><li><a href="#aboutRef">About</a></li></th>
					<th><li><a href="https://github.com/joshuaskling/Music-Visualizer">gitHub Repository</a></li></th></tr></table>
			</div>
			<a name="homeRef"></a>
			<div class="content" style="PADDING-TOP: 100px">
				<div class="main">
					<br>
					<!-- Heading levels -->
					<br>
					<h1 style="TEXT-ALIGN: CENTER">Welcome!</h1>
					<p><img class="img-responsive" src="assets/img/preview.png" alt="" style="display:block; margin:0 auto"></p>
					<a name="consoleRef"></a>
					<h2 style="TEXT-ALIGN: CENTER">We hope you enjoy this program, feel free to contact us using the information below, and let us know what you think.</h2>
					<br><br>
					<hr>

					<!-- Paragraphs -->
					
					<h2>autoBlender Console</h2>
					
					
					
					
					
					
					<script type="text/javascript" src="main.js"></script>
	
<?php
if(!file_exists("in_use")){
	
	unlink("Out.txt");
	unlink("terminate");
	$runFlag = !empty($_FILES["file"]);
	if(!$runFlag){
		
		echo('<form enctype="multipart/form-data" method="POST">
				Please choose an MP3 file: <input name="file" type="file" /><br>
				Please choose a rendering core: <select name="core">');
				
		foreach(scandir("pyBlender\Scripts\RenderingCores") as $core){
			$core = pathinfo($core, PATHINFO_FILENAME);
			if (strlen($core) >= 2)
				echo "<option value = '" . $core . "'>" . $core . "</option>";
		}
		
		echo('</select><br>
				Please choose a spectrogram level: 	<select name="mels">');
				
		for($i=5;$i<=20;$i++){
			echo "<option value=".$i.">".$i."</option>";
		}
		
		echo('</select><br>
				<input type="submit" value="Begin Processing" /></form><br>');
	}
	
	
	
	if ($runFlag){
	 	if ($_FILES["file"]["error"] > 0){
	 		echo "Error: No file selected!<br>";
			$runFlag = false;
	 	}
	 	else{
			if(!file_exists("in_use")){
				
				$core = $_POST['core'];
				$mels = $_POST['mels'];
				
				$sid = session_id();
				$block = fopen("in_use", "c+");
				fwrite($block, "Script is in use by SDI: ".$sid."\r\n");
				fclose($block);
				
				echo ("Selected file: ".$_FILES["file"]["name"]."<br>
				Size: ".(int)($_FILES["file"]["size"]/1024)." kB<br>");
				move_uploaded_file($_FILES["file"]["tmp_name"],$_FILES["file"]["name"]);
				
				echo "Selected core: " . $core . "<br>";
				echo "Selected levels: " . $mels . "<br><br>";
				
				$file_parts = pathinfo($_FILES["file"]["name"]);
				switch($file_parts['extension'])
				{
					case "mp3":
						rename($_FILES["file"]["name"],"pyBlender\Output\userMusic.mp3");
						$cmd = 'start "PHP Daemon" "C:\Program Files (x86)\PHP\v5.3\php.exe" -f mediator.php ' . $core . " " . $mels;
						pclose(popen($cmd, 'r'));
						break;

					case "": // Handle file extension for files ending in '.'
					case NULL: // Handle no file extension
					default:
						$runFlag = false;
						unlink($_FILES["file"]["name"]);
						unlink("in_use");
						break;
				}
				
				
			}
			else{echo('Oops! Another user is in the middle of the process... Please come back in a few minutes!');}
	 	}
	}
	echo('
	
	<script>
	window.setInterval("reloadFrame();", 1000);
	function reloadFrame() {
	document.getElementById("dynamic-content").src="dynamic.php#iFrameAnchor";}
	</script>
	
	<h1>Python Web Portal - *Process is ');
	
	if($runFlag){
		echo('ACTIVE*</h1>
		<iframe id="dynamic-content" 
			width="800" 
			height="600" 
			style="background-color:#000000;" 
			scrolling="yes">
		</iframe>
		<br><br>
		<a href="pyBlender/Output/Final.blend" download="pyBlend.blend">DOWNLOAD YOUR FILES WHEN THEY ARE READY</a>
		</body></html>
		');
	}
	else{
		echo('WAITING*</h1><br>
		Please initiate the process, using the menu above.');
	}
	
	
}

else{
	echo('
	<h1>SITE BUSY! Come back in a few minutes and try again!</h1>
	');
}
?>
					
					
					
					
					
					<a name="aboutRef"></a><br><br><br><br><hr>
					<!-- Responsive images -->
					<h2><u>About the Project - Details and Technical Background</u></h2><br>
					

					<!-- Lists -->
					<h3>Requirements for Use</h3>
					<p>There are only a few requirements for using autoBlender:</p>
					<ul>
						<li>An MP3 file of some music you would like to visualize</li>
						<li>A version of <a href="https://www.blender.org/download/">Blender</a> that runs on your computer</li>
					</ul>
					<hr>

					<h3>Instructions for Use</h3>
					<p>The following steps are a basic guide to using autoBlender:</p>
					<ol>
						<li>Upload and process your MP3 file using this online service</li>
						<li>Download the <code>.blend</code> file when the process is finished</li>
						<li>Open your new file with Blender, and add your music (see tutorial below)</li>
					</ol>
					<hr>

					<h3>Adding Music to Blender Scene</h3>
					<p>Use the drop down list to select the Video Sequence Editor:</p>
					<p><img class="img-responsive" src="assets/img/BlenderVSEscreen.png" alt=""></p>
					<br>
					<p>Use the add menu in the VSE to select and add your song to the scene:</p>
					<p><img class="img-responsive" src="assets/img/BlenderVSEadd.png" alt=""></p>
					<hr>

					<!-- Responsive images -->
					<h2>Technical Details</h2>
					<p>autoBlender was designed as an HTML/CSS/JavaScript/PHP front end to a set of Python scripts originally developed to 
					do audio analysis on MP3 files. The original program, called pyBlender, used Python to strip beat, tempo, volume, and spectrogram 
					information from a song file and then animate 3D scenes using that information. By doing large amounts of audio and data processing and 
					then feeding that information back in to Blender, we can use it to set shape, color, size, location, rotation, and many other animation 
					parameters. By then building different "cores" for Blender to render the scene, we can change the layout and style of these parameter values 
					which changes the entire look and feel of the animation. Feel free to play around with the different cores and see for yourself! If you actually 
					want to look under the hood, feel free to check out the <a href="https://github.com/joshuaskling/Music-Visualizer">code on gitHub</a> and poke around a bit!</p>
					<hr>


					<!-- Tables -->
					<h3>autoBlender Team</h3>
					<p>The following team members are responsible for autoBlender's development.</p>
					<table class="table">
						<thead>
							<tr>
								<th>Name</th>
								<th>Best Contact Method</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Andrew Porter</td>
								<td><a href="mailto:aporter@csumb.edu">aporter@csumb.edu</a></td>
							</tr>
							<tr>
								<td>Josh Kling</td>
								<td><a href="mailto:jkling@csumb.edu">jkling@csumb.edu</a></td>
							</tr>
							<tr>
								<td>Evan Schwander</td>
								<td><a href="mailto:eschwander@csumb.edu">eschwander@csumb.edu</a></td>
							</tr>
						</tbody>
					</table>

				</div>
			</div>
			<div class="footer">
				&copy; Copyright 2015
			</div>
		</div>
	</body>
</html>