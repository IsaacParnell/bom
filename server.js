var express = require('express');
    app = express();
    server = require('http').createServer(app);
    io = require('socket.io').listen(server);
    path = require('path');
server.listen(process.env.PORT || 80);

app.use("/", express.static(path.join(__dirname, 'public')));

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
    io.emit("incorrect", house);
  });

  socket.on('correct', function(house){
    //get the current score and add 10
    scores[house] += 10;
    io.emit("correct", house)
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

  //start a new HOTSEAT round
  socket.on('newHotseat', function(res){
      io.emit("roundHotseat", res);
      //all hotseat questions are 30 seconds
      var t = 30;
      timer = setInterval(function(){
        t--;
        io.emit("timerUpdate", t);
        console.log(t + " hotseat");

        if(t == 0){
          console.log("timer finished")
          clearInterval(timer);
          io.emit("endRound")
          io.emit("endHotseat") //TODO
        }
      }, 1000)

      socket.on('cancelRound', function(){
        io.emit("endRound")
        io.emit("endHotseat")

        console.log("round cancelled by host!")
        clearInterval(timer);
        io.emit("timerUpdate", 0);
      });



  });

  //when a hotseat answer is submitted
  socket.on('submitHotseat', function(req){
    clearInterval(timer);
    io.emit("timerUpdate", 0);

    console.log("recieved hot seat answer: " + req.submitted);

    io.emit("endRound")
    io.emit("endHotseat")

    if(req.submitted == req.answer){
      console.log("correct answer!")
      //true if correct, false if incorrect
      io.emit("hotseatResult", true)
    } else {
      io.emit("hotseatResult", false)
      console.log("incorrect answer :(")
    }
  });

  socket.on("revealAnswerHOTSEAT", function(){
    console.log("revealing hotseat answer")
    io.emit("revealAnswerHOTSEAT");
  })

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
