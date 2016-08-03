<?php
if (1){
	echo('
	<head>
	<meta http-equiv="refresh" content="2">
	</head>
	 <td align="left">
	<font color="green" face="Arial">
	<p>Session Loaded:'.date('Y-m-d').'</p><br>');
	$name = 'Out.txt';
	$handle = fopen($name, "c+");
	$size = filesize($name);
	if ($size>0){
		$contents = fread($handle,$size);
		$htmlString = $contents;
	}
	else {$htmlString = " ";}
	fclose($handle);
	
	echo('<pre><span class="inner-pre" style="font-size: 15px">'.$htmlString.'</span></pre>');
	echo('
	</font></td>
	<div id="iFrameAnchor"/>');
	}
?>