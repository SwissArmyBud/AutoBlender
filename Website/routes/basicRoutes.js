var router = require('express').Router();
var fs = require('fs-extra');       //File System - for file manipulation

module.exports = function(io, applicationPath){
  router.get('/', function(req, res) {
    res.render('index');
  });

  router.post('/upload', function(req, res) {
    var fstream;
    var clientID;
    // When BusBoy catches the file upload, stream it to the server upload area
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename);
        // Set path and init stream
        fstream = fs.createWriteStream(applicationPath + '/uploads/' + filename);
        file.pipe(fstream);
        // Handle file upload finishing
        fstream.on('close', function () {
            io.sockets.to(clientID).emit("uploadStatus", {status: "::DONE::"});
            console.log("Upload Finished of " + filename);
        });
    });
    req.busboy.on('field', function(fieldname, val) {
      if(fieldname == "socketID"){
        clientID = val;
        console.log("Client ID provided: " + clientID);
        io.sockets.to(clientID).emit("uploadStatus", {status: "--> I SEE YOU <--"});
      }
    });
    req.busboy.on('finish', function() {
      console.log('Done parsing form!');
      res.status(200).send("Finished file upload!");
      res.end();
    });
    // Pipe into the handler chain
    req.pipe(req.busboy);
  });

  router.get('/download', function(req, res) {
    res.send("Download is incoming!");
    console.log(req.body);
    console.log("Requesting file...");
  });

  return router;
};
