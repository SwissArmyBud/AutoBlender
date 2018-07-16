var HTTP_LISTENING_PORT = 30303;

// System Utils
var path = require('path');     //used for file path
var fs = require('fs-extra');       //File System - for file manipulation

// Express 4 HTTP Server
var express = require('express');    //Express Web Server
var app = express();

// Upload Middleware
var busboy = require('connect-busboy'); //middleware for form/file upload

// Socket.io Integration
var server = require('http').Server(app);
var io = require('socket.io')(server);

// Socket handlers
require(path.join(__dirname, "/Application/helpers/socketBinder"))(io,  __dirname + "/Website");

// Load/Init Routes
var basicRoutes = require(path.join(__dirname, 'Website/routes/basicRoutes'))(io, __dirname + "/Website");

// Setup upload manager, static path, and basic routes with view controller
app.use(busboy()); // file upload
app.use(express.static(path.join(__dirname, 'Website/public'))); // static path
app.set('view engine', 'ejs'); // view engine
app.set('views', path.join(__dirname, 'Website/views/pages')); // views path
app.use(basicRoutes); // routes

// Default error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Listen for requests
server.listen(HTTP_LISTENING_PORT, function() {
    console.log('Listening on port %d', server.address().port);
});
