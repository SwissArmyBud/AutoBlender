var router = require('express').Router();
var fs = require('fs-extra');       //File System - for file manipulation
var childProc = require('child_process');
var makeChild = childProc.spawn;

var ACCEPTED_FORMAT = ".mp3";

module.exports = function(io, applicationPath){
  router.get('/', function(req, res) {
    res.render('index');
  });

  router.post('/upload', function(req, res) {
    var fstream;
    var socketID;
    // When BusBoy catches the file upload, stream it to the server upload area
    req.busboy.on('file', function (fieldname, file, filename) {
      console.log("Uploading: " + filename);
      // Set path and init stream
      var basePath = applicationPath + '/Website/uploads/';
      fstream = fs.createWriteStream(basePath + filename);
      file.pipe(fstream);
      // Handle file upload finishing
      fstream.on('close', function () {
        console.log("Upload Finished of " + filename);
        // Async with callbacks:
        fs.move(basePath + filename, basePath + socketID + ACCEPTED_FORMAT, function(err){
          if (err) return console.error(err);
          io.sockets.to(socketID).emit("uploadStatus", {status: "::UPD"});
          console.log("Renamed " + filename + " to " + socketID + ACCEPTED_FORMAT);
          // Spawn an UNBUFFERED (-u) python3 child
          var pyBlender = makeChild("python3", ["-u", "./PyBlender/Scripts/autoBlender.py", "VUmeter", 8, socketID], options={
            cwd: applicationPath
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
            console.log('child process exited with code:' + parseInt(code));
            if(code == 0){
              io.sockets.to(socketID).emit("uploadStatus", {status: "::PYD"});
              // TODO - Send an error across if there is an issue
              io.sockets.to(socketID).emit("uploadStatus", {
                status: "::BRE",
                stdout: "test bufferString"
              });
            }
          });
        });
      });
    });
    req.busboy.on('field', function(fieldname, val) {
      if(fieldname == "socketID"){
        socketID = val;
        console.log("Socket ID provided: " + socketID);
        io.sockets.to(socketID).emit("uploadStatus", {status: "::SID"});
      }
    });
    req.busboy.on('finish', function() {
      console.log('Done parsing form!');
      res.status(200).send("Finished file upload!");
      res.end();
    });
    // Peer into the darkness
    req.pipe(req.busboy);
  });

  router.get('/download', function(req, res) {
    res.send("Download is incoming!");
    console.log(req.body);
    console.log("Requesting file...");
  });

  return router;
};
