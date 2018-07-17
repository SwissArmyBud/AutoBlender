var child = require('child_process').spawn;

var unbufferedPythonENV = process.env;
unbufferedPythonENV.PYTHONUNBUFFERED = "on";

module.exports = {
  startAudioAnalysis: function(io, path, renderCore, melBins, socketID, cb){
    // Spawn an UNBUFFERED Python3 child for audio analysis
    var pyBlender = child("python3", ["./PyBlender/Scripts/autoBlender.py", renderCore, melBins, socketID], options={
      cwd: path,
      env: unbufferedPythonENV
    });
    // Grab output and send back to client
    pyBlender.stdout.on('data', function(buffer){
      var bufferString = buffer.toString();
      io.sockets.to(socketID).emit("uploadStatus", {
        status: "::PY3",
        stdout: bufferString
      });
      console.log('stdout:');
      console.log(bufferString);
    });
    // Error to cosole for debug
    pyBlender.stderr.on('data',  function(buffer){
      console.log('stderr:');
      console.log(buffer.toString());
    });
    // Spin up next child when processing done
    pyBlender.on('close',  function(code){
      console.log(socketID + ' child process exited with code:' + parseInt(code));
      io.sockets.to(socketID).emit("uploadStatus", {status: "::PYD"});
      if(cb && typeof(cb)=="function"){
        cb(code);
      }
    });
  },
  startBlenderEngine: function(io, path, socketID, cb){
    console.log("Starting blender engine for socketID: " + socketID);
    // blender -b -P path/my_script.py --
    // Spawn an UNBUFFERED Python3 child for audio analysis
    var scriptPath = "./Website/downloads/" + socketID + ".brs";
    var renderEngine = child("blender", ["-b", "-P", scriptPath, "--", socketID, 6], options={
      cwd: path,
      env: unbufferedPythonENV
    });
    // Grab output and send back to client
    renderEngine.stdout.on('data', function(buffer){
      var bufferString = buffer.toString();
      io.sockets.to(socketID).emit("uploadStatus", {
        status: "::BRE",
        stdout: bufferString
      });
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
      console.log(socketID + 'child process exited with code:' + parseInt(code));
      io.sockets.to(socketID).emit("uploadStatus", {status: "::BRD"});
      if(cb && typeof(cb)=="function"){
        cb(code);
      }
    });


  }
};
