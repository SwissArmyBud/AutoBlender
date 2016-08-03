
function myCommand() {
	//var textValue = document.getElementsByName('txtbox')[0].value
	var http = new XMLHttpRequest();
	http.open("POST", "command.php", true);
	http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	var params = "command=" + textValue; 
	http.send(params);
}

function myTerminator() {
	$conf = confirm("Terminate?");
		if($conf){
			var http = new XMLHttpRequest();
			http.open("POST", "terminator.php", true);
			http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			http.send("");
			setTimeout(function(){
				location.reload();
			}, 3000);
			return true;
		}
}
