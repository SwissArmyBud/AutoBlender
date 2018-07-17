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
      console.log(socketID + 'child process exited with code:' + parseInt(code));
      io.sockets.to(socketID).emit("uploadStatus", {status: "::PYD"});
      if(cb && typeof(cb)=="function"){
        cb(code);
      }
    });
  },
  startBlenderEngine: function(io, socketID, cb){
    console.log("Starting blender engine for socketID: " + socketID);
    // TODO - Start blender scene construction
    io.sockets.to(socketID).emit("uploadStatus", {
      status: "::BRE",
      stdout: "test bufferString"
    });
    if(cb && typeof(cb)=="function"){
      cb(0);
    }
  }
};
