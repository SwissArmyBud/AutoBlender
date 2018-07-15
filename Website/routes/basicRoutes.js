var router = require('express').Router();
var fs = require('fs-extra');       //File System - for file manipulation
var busboy = require('connect-busboy'); //middleware for form/file upload

module.exports = function(io){
  router.get('/', function(req, res) {
    res.render('index');
  });

  router.post('/upload', function(req, res) {
    var fstream;
    try{
      console.log("Upload ID: " + req.get("uploadID"));
      io.sockets.socket(req.get("uploadID")).emit("uploadStatus", {status: "::START::"});
    } catch (error){
      console.log("Bad upload ID!");
    }
    // Send the request through BusBoy
    req.pipe(req.busboy);
    // When BusBoy catches the file upload, stream it to the server upload area
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename);
        // Set path and init stream
        fstream = fs.createWriteStream(__dirname + '/Website/upload/' + filename);
        file.pipe(fstream);
        // Handle file upload finishing
        fstream.on('close', function () {
            console.log("Upload Finished of " + filename);
            res.end(200);
        });
    });
  });

  router.get('/download', function(req, res) {
    res.send("Download is incoming!");
    console.log(req.body);
    console.log("Requesting file...");
  });

  return router;
};
