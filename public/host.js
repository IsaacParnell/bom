var socket = io()

$("#clearTeamDisplay").click(function(){
  socket.emit("clearTeamDisplay")
});

$("#clearTeamDisplay2").click(function(){
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

socket.on("hostMessage", function(m){
  console.log(m);
  alertify
  .delay(0)
  .closeLogOnClick(true)
  .log("Message: " + m);
  $("#recieved").append("<li>" + m + "</li>");
})

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
  $.ajax({
    url: 'questions.csv',
    dataType: 'text',
  }).done(function(data){
    data = data.split(/\r\n|\n/);

    for(var i = 0; i < data.length; i++){
      data[i] = data[i].split(",#");
    }
    for(var i = 0; i < data.length; i++){
      item = data[i]
      if(item[0] == currentGroup && $("#questionDisplay").html() == item[2]){
        //item[3] here is the answer for the current question
        console.log("ANSWER for CURRENT QUESTION: " + item[3])
        $("#acceptedAnswer").html("<p>" + item[3] + "</p>")
      }
    }
  })

  console.log('new round started, clearing answers...')
  $("#score p")
  .html('no answer yet')
  .css('color', 'white')
});

socket.on("timerUpdate", function(t){
  $("#timer").html(t);
  $("#timerHOTSEAT").html(t);
});

socket.on("ans", function(res){
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

$("#showGraph").click(function(){
  socket.emit("loadScreen", "graph.html")
})

$("#startSpinner").click(function(){
  socket.emit("loadScreen", "spinner.html")
})

//HOTSEAT FUNCTIONS and VARIABLES
$("#loadHotSeat").click(function(){
  socket.emit("loadScreen", "hotseatScreen.html");
})

$("#loadScreen").click(function(){
  socket.emit("loadScreen", "screen.html");
})

$("#hotseatGroups li").click(function(){
  var group = $(this).attr('id');
  $("#groupHOTSEAT").html(group)
  $("#hotseatQuestions").empty();
  $.ajax({
    url: 'hotseatQuestions.csv',
    dataType: 'text',
  }).done(function(data){
    data = data.split(/\r\n|\n/);
    for(var i = 0; i < data.length; i++){
      data[i] = data[i].split(",#");
    }
    for(var i = 0; i < data.length; i++){
      var item = data[i]
      //cycles through all the questions looking for questions from that group.
      if(item[0] == group){
        $("#question #hotseatQuestions").append("<li>" + item[1] + "</li>");
        $("#question #hotseatQuestions li").click(function(){
          selectQuestion($(this).text())
        })
      }
    }
  })
})

var possibleHotseat = [];
var acceptedHotseat = "";
var questionHotseat = "";

function selectQuestion(q){
  //console.log(q)

  //reset values
  possibleHotseat = [];
  acceptedHotseat = "";
  questionHotseat = "";

  questionHotseat = q;

  $.ajax({
    url: 'hotseatQuestions.csv',
    dataType: 'text',
  }).done(function(data){
    data = data.split(/\r\n|\n/);
    for(var i = 0; i < data.length; i++){
      data[i] = data[i].split(",#");
    }

    for(var i = 0; i < data.length; i++){
      var item = data[i]
      if(item[1] == q){
        //console.log(item)
        for(var k = 0; k < 4; k++){
          possibleHotseat.push(item[k+2])
        }
        //right answer is always the first answer in the list (randomised later)
        acceptedHotseat = item[2]
      }
    }


    console.log("accepted: " + acceptedHotseat)
    console.log("possible: " + possibleHotseat)
    console.log("Question: " + questionHotseat)

    //update display
    $("#questionHOTSEAT").text(questionHotseat)
    $("#acceptedHOTSEAT").text(acceptedHotseat)
  })
}

$("#startHOT").click(function(){
  //start a new hotseat round
  console.log("starting a new hotseat round!!!!")
  socket.emit("newHotseat", [questionHotseat, possibleHotseat, acceptedHotseat])

  //clear previous round
  $("#answerHOTSEAT").css("color", "white")
  $("#answerHOTSEAT").text("")
})

$("#cancelHOT").click(function(){
  //cancel HOTSEAT roundHotseat
  console.log("cancelling hotseat")
  socket.emit("cancelRound")
})

socket.on("hotseatResult", function(result){
  //result will be true if they got it right
  if(result.result){
    $("#answerHOTSEAT").text("Correct")
    $("#answerHOTSEAT").css("color", "green")
  } else {
    $("#answerHOTSEAT").text("Incorrect")
    $("#answerHOTSEAT").css("color", "red")
  }
})

$("#revealHOT").click(function(){
  console.log("revealing hotseat answer")
  socket.emit("revealAnswerHOTSEAT");
})
