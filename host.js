var socket = io()

$("#clearTeamDisplay").click(function(){
  socket.emit("clearTeamDisplay")
});

$("#30").click(function(){
  newRound(30, $("#questionDisplay").text());
});

$("#60").click(function(){
  newRound(60, $("#questionDisplay").text());
});

function newRound(timeLimit, questionText){
  console.log("starting new round for " + timeLimit + "s for the question " + questionText);
  socket.emit("newRound", {t: timeLimit, text: questionText})
}

$("#graham #correct").click(function(){
  correct("g");
})
$("#wesley #correct").click(function(){
  correct("w");
})
$("#booth #correct").click(function(){
  correct("b");
})
$("#elliot #correct").click(function(){
  correct("e");
})

$("#graham #incorrect").click(function(){
  incorrect("g");
})
$("#wesley #incorrect").click(function(){
  incorrect("w");
})
$("#booth #incorrect").click(function(){
  incorrect("b");
})
$("#elliot #incorrect").click(function(){
  incorrect("e");
})

function correct(house){
  socket.emit("correct", house);
}

function incorrect(house){
  socket.emit("incorrect", house);
}

socket.on('scores', function(scores){
  $("#graham #score").html(scores["g"]);
  $("#elliot #score").html(scores["e"]);
  $("#wesley #score").html(scores["w"]);
  $("#booth #score").html(scores["b"]);
});

socket.on("round", function(res){
  //TODO show accepted answers on the side, maybe put them into the questions.csv file and read them directly???
  console.log('new round started, clearing answers...')
  $("#score p")
  .html('no answer yet')
  .css('color', 'white')
});

socket.on("timerUpdate", function(t){
  $("#timer").html(t);
});

socket.on("ans", function(res){
  //TODO update answer page
  switch(res.house){
    case "B":
      $("#booth #answer")
      .html(res.answer)
      .css("color", "blue");
    break;

    case "W":
      $("#wesley #answer")
      .html(res.answer)
      .css("color", "yellow");
    break;

    case "E":
      $("#elliot #answer")
      .html(res.answer)
      .css("color", "green");
    break;

    case "G":
      $("#graham #answer")
      .html(res.answer)
      .css("color", "red");
    break;
  }
});

$("#graham #submitedit").click(function(){
  var editedScore = $("#g_editscore").val()
  $("#g_editscore").val('');
  socket.emit("editScore", {house: "g", score: editedScore});
})

$("#elliot #submitedit").click(function(){
  var editedScore = $("#e_editscore").val()
  $("#e_editscore").val('');
  socket.emit("editScore", {house: "e", score: editedScore});
})

$("#wesley #submitedit").click(function(){
  var editedScore = $("#w_editscore").val()
  $("#w_editscore").val('');
  socket.emit("editScore", {house: "w", score: editedScore});
})

$("#booth #submitedit").click(function(){
  var editedScore = $("#b_editscore").val()
  $("#b_editscore").val('');
  socket.emit("editScore", {house: "b", score: editedScore});
})
