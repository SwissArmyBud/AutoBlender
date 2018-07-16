
var fs = require('fs-extra');       //File System - for file manipulation

module.exports = function(io, applicationPath){
  // TODO - Move to import
  io.on('connection', function(socket){
    console.log("Client connected!");
    console.log(socket.id);
    socket.on('disconnect', function(){
      console.log("Client disconnected!");
      console.log(socket.id);
      var uploadExtensions = [".mp3"];
      uploadExtensions.forEach(function(extension){
        fs.remove(applicationPath + "/Website/uploads/" + socket.id + extension, function(err){
          if (err) return console.error(err);
          console.log(extension + ' cleanup ok!');
        });
      })
      var downloadExtensions = [".brs", ".bts", ".vol", ".mel"];
      downloadExtensions.forEach(function(extension){
        fs.remove(applicationPath + "/Website/downloads/" + socket.id + extension, function(err){
          if (err) return console.error(err);
          console.log(extension + ' cleanup ok!');
        });
      })
    });
  });
};
