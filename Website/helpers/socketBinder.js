
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
      for(var upExt in uploadExtensions){
        fs.remove(applicationPath + "/Website/uploads/" + socket.id + upExt, function(err){
          if (err) return console.error(err);
          console.log(upExt + ' cleanup ok!');
        });
      }
      var downloadExtensions = [".brs", ".bts", ".vol", ".mel"];
      for(var dnExt in downloadExtensions){
        fs.remove(applicationPath + "/Website/downloads/" + socket.id + dnExt, function(err){
          if (err) return console.error(err);
          console.log(dnExt + ' cleanup ok!');
        });
      }
    });
  });
};
