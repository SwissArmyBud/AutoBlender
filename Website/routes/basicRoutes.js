var router = require('express').Router();
var fs = require('fs-extra');       //File System - for file manipulation

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
    // When BusBoy catches the file upload, stream it to the server upload area
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename);
        // Set path and init stream
        fstream = fs.createWriteStream(__dirname + '../upload/' + filename);
        file.pipe(fstream);
        // Handle file upload finishing
        fstream.on('close', function () {
            io.sockets.socket(req.get("uploadID")).emit("uploadStatus", {status: "::START::"});
            console.log("Upload Finished of " + filename);
            res.end(200);
        });
    });
    req.busboy.on('field', function(fieldname, val) {
      console.log('Field [' + fieldname + ']: value: ' + inspect(val));
    });
    req.busboy.on('finish', function() {
      console.log('Done parsing form!');
      res.writeHead(303, { Connection: 'close', Location: '/' });
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
