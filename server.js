var express = require('express');
    app = express();
    server = require('http').createServer(app);
    io = require('socket.io').listen(server);

server.listen(process.env.PORT || 80);

app.use('/', express.static(__dirname, + '/'));

var host = "";
var clientList = [];

io.on('connection', function(socket){
  console.log(socket.id + " connected")

  socket.on('newRound', function(res){
      io.emit("round", res.text)

      var t = res.t;
      var timer = setInterval(function(){
        t--;
        io.emit("timerUpdate", t);
        console.log(t);

        if(t == 0){
          console.log("timer finished")
          clearInterval(timer);
          io.emit("endRound")
        }
      }, 1000)
  });

  socket.on('cancelRound', function(){
    io.emit("endRound")
    console.log("round cancelled by host!")
  });

  socket.on('houseUpdate', function(house){
    switch(house){
      case "B":
      clientList.push([socket.id, house])
      break;

      case "E":
      clientList.push([socket.id, house])
      break;

      case "W":
      clientList.push([socket.id, house])
      break;

      case "G":
      clientList.push([socket.id, house])
      break;

      default:
      console.log("an invalid house code was entered on socket " + socket.id)
      break;
    }

    console.log(clientList)

  })

  socket.on('host', function(){
    host = socket.id;
  });

  socket.on('disconnect', function(){
    for(var i = 0; i < clientList.length; i++){
      if(clientList[i][0] == socket.id){
        clientList.splice(i,1);
      }
    }
  })
})
