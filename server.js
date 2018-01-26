

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
app.use(express.static('public'));

//Serves all the request which includes /images in the url from Images folder
app.use('/public', express.static(__dirname + '/public'));

var server = app.listen(process.env.PORT || 80);



var scores = {};

scores["g"] = 0;
scores["e"] = 0;
scores["w"] = 0;
scores["b"] = 0;

var host = "";
var clientList = [];

io.on('connection', function(socket){
  console.log(socket.id + " connected")
  io.emit('scores', scores);

  socket.on("editScore", function(res){
      console.log("Changing score of house: " + res.house + " from " + scores[res.house] + " to " + res.score)
      scores[res.house] = parseInt(res.score);
      io.emit("scores", scores);
  });

  socket.on("answer", function(res){
      console.log("Got answer from " + res.house + ": " + res.answer);
      io.emit("ans", res);
  });

  socket.on('incorrect', function(house){
    io.emit('incorrect', house);
  });

  socket.on('correct', function(house){
    //get the current score and add 10
    scores[house] += 10;
    io.emit('correct', house)
    io.emit('scores', scores)

    console.log(scores);
  });

  socket.on("hostMessage", function(m){
    console.log("new message for host " + m);
    io.emit("hostMessage", m);
  });
  socket.on("clientMessage", function(m){
      console.log("new message for client: " + m);
      io.emit("clientMessage", m);
  });

  socket.on("clearTeamDisplay", function(){
      io.emit("clearTeamDisplay");
  });

  socket.on('newRound', function(res){
      io.emit("round", res.text);
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

      socket.on('cancelRound', function(){
        io.emit("endRound")
        console.log("round cancelled by host!")
        clearInterval(timer);
        io.emit("timerUpdate", 0);
      });
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
