
module.exports = function(io, applicationPath){
  // TODO - Move to import
  io.on('connection', function(socket){
    console.log("Client connected!");
    console.log(socket.id);
    socket.on('disconnect', function(){
      console.log("Client disconnected!");
      console.log(socket.id);
      fs.remove(applicationPath + "/uploads/" + socket.id + ".*", function(err){
        if (err) return console.error(err);
        console.log('Cleanup ok!');
      });
      fs.remove(applicationPath + "/downloads/" + socket.id + ".*", function(err){
        if (err) return console.error(err);
        console.log('Cleanup ok!');
      });
    });
  });
};
