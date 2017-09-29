var socket = io()

$("#30").click(function(){
  newRound(30, $("#questionDisplay").text());
})

$("#60").click(function(){
  newRound(60, $("#questionDisplay").text());
})

function newRound(timeLimit, questionText){
  console.log("starting new round for " + timeLimit + "s for the question " + questionText);
  socket.emit("newRound", {t: timeLimit, text: questionText})
}

socket.on("timerUpdate", function(t){
  $("#timer").html(t);
})
