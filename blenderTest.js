var child = require('child_process').spawn;

var unbufferedPythonENV = process.env;
unbufferedPythonENV.PYTHONUNBUFFERED = "on";

var scriptPath = "./Website/downloads/" + socketID + ".brs";
var renderEngine = child("blender", ["-b", "-P", scriptPath, "--", socketID, 6], options={
	cwd: __dirname,
	env: unbufferedPythonENV
});
// Grab output and send back to client
renderEngine.stdout.on('data', function(buffer){
	var bufferString = buffer.toString();

	console.log('stdout:');
	console.log(bufferString);
});
// Error to cosole for debug
renderEngine.stderr.on('data',  function(buffer){
	console.log('stderr:');
	console.log(buffer.toString());
});
// Fire callback on done, with exit code
renderEngine.on('close',  function(code){
	console.log('child process exited with code:' + parseInt(code));
});
