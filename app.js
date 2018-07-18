var HTTP_LISTENING_PORT = 6363;

// System Utils
var path = require('path');     //used for file path
var fs = require('fs-extra');       //File System - for file manipulation

// Express 4 HTTP Server
var express = require('express');    //Express Web Server
var app = express();

// Upload Middleware for Express 4
var busboy = require('connect-busboy'); //middleware for form/file upload

// Socket.io Integration
var server = require('http').Server(app);
var io = require('socket.io')(server);

// AutoBlender imports
var pyRunner = require(path.join(__dirname, "Website/helpers/pythonRunner"));
// FS helper imports
var fsHelper = require(path.join(__dirname, "Website/helpers/fileSystem"));

var jobFinishedNotice = function(socketID){
  io.sockets.to(socketID).emit("uploadStatus", {status: "::RDY"});
};

var autoBlender = function(error, filename, socketID){
  if(error){
    console.log("Error with AutoBlender setup for " + socketID + ":");
    console.log(error);
    console.log("Filename: " + filename);
  } else {
    // Upload done
    io.sockets.to(socketID).emit("uploadStatus", {status: "::UPD"});
    // Capture new file for processing (upload folder, file, socketID, cb)
    fsHelper.captureMedia(__dirname + "/Website/uploads/", filename, socketID, function(error){
      if(error){
        console.log("Error capturing file for " + socketID + ": ");
        console.log(error);
      } else {
        // TODO - Stop faking these variables (set from site)
        var renderCore = "VUmeter";
        var melBins = 10;
        // Start audio processing (socket IO, app path, core, bins, socketID, cb)
        pyRunner.startAudioAnalysis(io, __dirname, renderCore, melBins, socketID, function(error){
          if(error){
            console.log("Error processing file for " + socketID + ": ");
            console.log(error);
          } else {
            console.log("Analysis done for socketID -> " + socketID);
            pyRunner.startBlenderEngine(io, __dirname, socketID, function(error){
              if(error){
                console.log(error);
              } else {
                console.log("Blender Engine done for socketID -> " + socketID);
                jobFinishedNotice(socketID);
              } // if/else (error)
            }); // startBlenderEngine
          } // if/else (error)
        }); // startAudioAnalysis
      } // if/else (error)
    }); // captureMedia
  } // else
};

var disconnectHandler = function(socketID){
  fsHelper.cleanupOnDisconnect(__dirname, socketID);
};

// Socket handlers (socket IO, app path, disconnect callback(socketID))
require(path.join(__dirname, "Website/helpers/socketBinder"))(io, undefined, disconnectHandler);

// Load route builder
var routeBuilder = require(path.join(__dirname, 'Website/routes/basicRoutes'));
// Init Routes (socket IO, upload path, accepted format, upload callback(err, name, socket))
var routes = routeBuilder(io, __dirname + "/Website/uploads/", fsHelper.ACCEPTED_FORMAT, autoBlender);

// Setup upload manager, static path, and basic routes with view controller
app.use(busboy()); // file upload
app.use(express.static(path.join(__dirname, 'Website/public'))); // static path
app.use(express.static(path.join(__dirname, 'Website/downloads'))); // static path
app.set('view engine', 'ejs'); // view engine
app.set('views', path.join(__dirname, 'Website/views/pages')); // views path
app.use(routes); // routes

// Default error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Listen for requests
server.listen(HTTP_LISTENING_PORT, function() {
    console.log('Listening on port %d', server.address().port);
});
