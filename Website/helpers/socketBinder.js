// Just controls simple connect/disconnect behavior
module.exports = function(io, cCB, dCB){
  io.on('connection', function(socket){
    console.log("Client connected!");
    console.log(socket.id);
    if(cCB && typeof(cCB)=="function"){
      cCB(socket.id);
    }
    socket.on('disconnect', function(){
      console.log("Client disconnected!");
      console.log(socket.id);
      if(dCB && typeof(dCB)=="function"){
        dCB(socket.id);
      }
    });
  });
};
