
var fs = require('fs-extra');       //File System - for file manipulation
var ACCEPTED_FORMAT = ".mp3";

module.exports = {
  ACCEPTED_FORMAT: ACCEPTED_FORMAT,
  captureMedia: function(basePath, filename, socketID, cb){  // Async with finshed cb
    fs.move(basePath + filename, basePath + socketID + ACCEPTED_FORMAT, function(err){
      if (err){
        console.log("Error with move:" + err);
        if(cb && typeof(cb)=="function"){
          cb(err);
        }
      } else {
        console.log("Renamed " + filename + " to " + socketID + ACCEPTED_FORMAT);
        if(cb && typeof(cb)=="function"){
          cb(undefined);
        }
      }
    });
  },
  cleanupOnDisconnect: function(basePath, socketID){
    console.log("Cleanup started for " + socketID);
    var uploadExtensions = [".mp3"];
    uploadExtensions.forEach(function(extension){
      fs.remove(basePath + "/Website/uploads/" + socketID + extension, function(err){
        if (err) return console.error(err);
        console.log(extension + ' cleanup ok!');
      });
    });
    var downloadExtensions = [".brs", ".bts", ".vol", ".mel"];
    downloadExtensions.forEach(function(extension){
      fs.remove(basePath + "/Website/downloads/" + socketID + extension, function(err){
        if (err) return console.error(err);
        console.log(extension + ' cleanup ok!');
      });
    });
  }
};
