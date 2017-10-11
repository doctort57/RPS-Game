
// 1. Initialize Firebase

var config = {
    apiKey: "AIzaSyBwwo-TebMOw-vankvkEo_pkVH8ULU191U",
    authDomain: "classproject-9d2ad.firebaseapp.com",
    databaseURL: "https://classproject-9d2ad.firebaseio.com",
    projectId: "classproject-9d2ad",
    storageBucket: "classproject-9d2ad.appspot.com",
    messagingSenderId: "765615276448"
};

firebase.initializeApp(config);
var database = firebase.database();


// Global variables for player1 and player2 info

var refname = "/player1";
var msgGame = "";
var winnerMsg = "";
var loserMsg = "";
var player = "";
var playerName = "";
var player1Nm = "";
var player2Nm = "";
var player1Choice = "";
var player2Choice = "";
var player1Wins = 0;
var player2Wins = 0;
var player1Losses = 0;
var player2Losses = 0;
var player1Ties = 0;
var player2Ties = 0;

// arrays for inital values on new player add 
var player1 = {player: "player1", playerName:"",choice:"",wins:0,losses:0,ties:0,dateAdded: firebase.database.ServerValue.TIMESTAMP};
var player2 = {player: "player2",choice:"",wins:0,losses:0,ties:0,dateAdded: firebase.database.ServerValue.TIMESTAMP};

 database.ref().once("value", function(snapshot) {

                 snapshot.forEach(function(childSnapshot) {
                  var childData = childSnapshot.val();
   
                    if (childData.player == "player1") {
                        player = childData.player;
                        playerName = childData.playerName;
                        player1Wins = childData.wins;
                        player1Losses = childData.losses;
                        player1Ties = childData.ties;
                
                        setPlayer(player);
                    } else {
                        player = childData.player;
                        playerName = childData.playerName;
                        player2Wins = childData.wins;
                        player2Losses = childData.losses;
                        player2Ties = childData.ties;
                        setPlayer(player);

                    }




                     });                     
  }); 








// on child added 

database.ref().on("child_added", function(snapshot, prevChildKey) {
        var newPost = snapshot.val();

        // set variables from snapshot

        playerName  =  newPost.playerName;
        player = newPost.player;
        $("#player-input").val("");

        if (newPost.player == "player1") {
             player1Nm = newPost.playerName;
             
             setPlayer(player);
       
      //        $('#player1').css({"background-color": "lightgrey"});
      //           $('#player2').css({"background-color": "lightblue"});
             $('#add-player').val("Add Player 2");
        } else {
         
             player2Nm = newPost.playerName;
             setPlayer(player);
         
             $('#player-form').hide();
        }
});

// on data changed

    database.ref().on("child_changed", function(snapshot, prevChildKey) {
      var newPost = snapshot.val();

      var choice = newPost.choice;
      var player = newPost.player;
      playerName  =  newPost.playerName;

      // set answers into variables for each player

        if (newPost.player == "player1") {
            player1Choice = choice;
        } else {
            player2Choice = choice;

        }
    
        if (newPost.choice !== ""){
            setChoice(choice,player);
        } 


        if (newPost.player == "player1") {
                player1Choice = choice;
                setPlayer(player);
          } else {
             
                player2Nm = newPost.playerName;
                setPlayer(player);

          }
     
    });

    // reset page for adding new players
    function changePlayers() {
              // empty player boxes
              $("#player1").empty();
              $("#player2").empty();
              $("#player2").fadeTo("slow", 0.4);

              // reset answer
              $("#answer").empty();
              p = $("<p>");
              p = $("<p>").text("Play Another Game");
              $(p).css({"color": "green", "font-size": "100%"});
              $("#answer").append(p);

              $("#player-form").show();
              $('#add-player').val("Add Player 1");
              refname = "/player1";
              $("#new-players").hide();
              $("#gametalk").empty();
            

    }


    // set player choices into Answer div

    function setChoice(rps,player){

          var p = $("<p>");
          // set player choice in answer box      
          if (player == "player1"){
                  $("#answer").empty();
                  $("#new-players").hide();

                  // add player 1 name to answer box
                  p = $("<p>").text(player1Nm + " Chooses");
                  $(p).css({"color": "black", "font-size": "100%"});
                  $("#answer").append(p);

                  // add player1 choice to answer box
                  p = $("<p>").text(rps);
                  $(p).css({"color": "red", "font-size": "175%"});
                  $(p).attr("id",rps);
                  $("#answer").append(p);
                  $("#player1").fadeTo("slow", 0.4);
                  $("#player2").fadeTo("slow", 1);   
          } else { 

                  // add player 2 name to answer box
                  p = $("<p>").text(player2Nm + " Chooses");
                  $(p).css({"color": "black", "font-size": "100%"});
                  $("#answer").append(p);

                  // add player 2 choice to answer box
                  p = $("<p>").text(rps);
                  $(p).css({"color": "blue", "font-size": "175%"});
                  $(p).attr("id",rps);
                  $("#answer").append(p);
                  $("#player2").fadeTo("slow", 0.4);

              // both cholces selected - call game function and return message
              if (player1Choice !== "" && player2Choice !== "") {
                      msgGame = playTime(player1Choice, player2Choice);
                    
                      // display game result in answer box
                      var p = $("<p>");
                      p = $("<p>").text(msgGame);
                      $(p).css({"color": "purple", "font-size": "100%"});
                      $("#answer").prepend(p);

                      // display winner msg
                      p = $("<p>");
                      p = $("<p>").text(winnerMsg);
                      $(p).css({"color": "red", "font-size": "100%"});
                      $("#gametalk").css({"border": "3px solid black"});
                      $("#gametalk").append(p);

                      // display loser msg
                      p = $("<p>");
                      p = $("<p>").text(loserMsg);
                      $(p).css({"color": "blue", "font-size": "100%"});
                      $("#gametalk").append(p);
                      $("#player1").fadeTo("slow", 1);
                      $("#new-players").show();

                      // delay and then set new game message
                      window.setTimeout(function(){
                          $("#answer").empty();
                          p = $("<p>");
                          p = $("<p>").text("Play Another Game");
                          $(p).css({"color": "green", "font-size": "100%"});
                          $("#answer").append(p);
                         
                      }, 03000);
              }
          }
    }

    // Set player boxes player1 and player2
    function setPlayer(player) {
  
          $("#"+player).empty();
          // player name
          var p = $("<p>");
          p = $("<p>").text(playerName);
          if (player == "player1"){
              $(p).css({"color": "black", "font-size": "200%"});
          } else {
              $(p).css({"color": "white", "font-size": "200%"});
          }
          $("#"+player).append(p);

          // ROCK
          p = $("<p>").text("Rock");
          $(p).addClass(player);
          $(p).attr("id","Rock");
          $(p).css({"color": "red", "font-size": "150%"});
          $("#"+player).append(p);

          // PAPER
          $("#"+player).append(p);
          p = $("<p>").text("Paper");
          $(p).addClass(player);
          $(p).attr("id","Paper");
          $(p).css({"color": "white", "font-size": "150%"});
          $("#"+player).append(p);

          // SCISSORS
          p = $("<p>").text("Scissors");
          $(p).addClass(player);
          $(p).attr("id","Scissors");
          $(p).css({"color": "blue", "font-size": "150%"});
          $("#"+player).append(p);

          // Player Stats
          if (player == "player1"){
                p = $("<p>").text("Wins: " + player1Wins + "   Losses: "+ player1Losses + " Ties: " + player1Ties);

          } else {
                p = $("<p>").text("Wins: " + player2Wins + "   Losses: "+ player2Losses + " Ties: " + player2Ties);
                $("#player2").fadeTo("slow", 0.4);
          }

          $(p).css({"color": "purple", "font-size": "90%"});
          $("#"+player).append(p);

          refname = "/player2";
    }
 

    // 2. Button for adding PLayers
    $("#add-player").on("click", function(event) {
          event.preventDefault();

          // set players into object with initial values
          if (refname == "/player1") {
            // set name field in player 1 object
            player1.playerName  = $("#player-input").val().trim(); 

            // WRITE Player 1 initial to firebase
            firebase.database().ref('player1/').set(player1);
            refname = "/player2";
            $("#player1").fadeTo("slow", 0.5);
            $("#player2").fadeTo("slow", 1);
        } else {
            // set name field in player 2 object
            player2.playerName  = $("#player-input").val().trim(); 

            // WRITE Player 2 initial to firebase
            firebase.database().ref('player2/').set(player2);
            refname = "/player1";
            $("#player1").fadeTo("slow", 1);
            $("#player2").fadeTo("slow", 1);
        }

    });

    // add players to Firebase
    function setPlayers() {

        var refname = "/" + $(this).attr("class");
        // use array for update
        var myData = {};
              
        if (refname == "/player1") {

          // grabs the input from the textbox
          player1Choice = $(this).text().trim();

          // update player choice info for player2
          myData[`/player1/choice`] = player1Choice;
          firebase.database().ref().update(myData);
          refname = "/player2";
       
        } else {

          // grabs the input from the textbox
          player2Choice = $(this).text().trim();

          // update player choice info for player2
          myData[`/player2/choice`] = player2Choice;
          firebase.database().ref().update(myData);
        }    
    };

    // update Player stats in firebase

    function updatePlayer() {

          // use array for update
          var myData = {};

          // set player 1 values in array
          myData[`/player1/choice`] = "";
          myData[`/player1/wins`] = player1Wins;
          myData[`/player1/losses`] = player1Losses;
          myData[`/player1/ties`] = player1Ties;

          // update counts for player1 in firebase
          firebase.database().ref().update(myData);
          // set player 2 values in array
          myData[`/player2/choice`] = "";
          myData[`/player2/wins`] = player2Wins;
          myData[`/player2/losses`] = player2Losses;
          myData[`/player2/ties`] = player2Ties;

          // update counts for player2 in firebase
          firebase.database().ref().update(myData); 
            
    };

    // process Answers return result message and update firebase values

    function playTime(ans1, ans2) {
         
          // Rock beats Scissors
          if (ans1 == "Rock" && ans2 === "Scissors") {
                  player1Wins ++;
                  player2Losses ++;
                  updatePlayer();
                  winnerMsg = player1Nm + ": I Rocked You Dude !!!";
                  loserMsg =  player2Nm + ": Try again Smart Guy !!!";
                  return "Rock crushes Scissors - " + player1Nm + " Wins";
          } else {

          //  Scissors beats Paper
          if (ans1 == "Scissors" && ans2 === "Paper") {
                  player1Wins ++;
                  player2Losses ++;
                  updatePlayer();
                  winnerMsg = player1Nm + ": Cut You up Paper Boy ###";
                  loserMsg =  player2Nm + ": Dont Like you Scissors Kid ha ha ha";
                  return "Scissors cuts Paper - " + player1Nm + " Wins";
          } else {

          //  Paper beats Rock
          if (ans1 == "Paper" && ans2 === "Rock") {
                  player1Wins ++;
                  player2Losses ++;
                  updatePlayer();
                  winnerMsg = player1Nm + ": Covered you Up Rock for brains";
                  loserMsg =  player2Nm + ": Stupid Paper Dude";
                  return "Paper covers Rock - " + player1Nm + " Wins";
          } else {

          // Rock beats Scissors
          if (ans2 == "Rock" && ans1 === "Scissors") {
                  player2Wins ++;
                  player1Losses ++;
                  updatePlayer();
                  winnerMsg = player2Nm + ": Your Scissors are no match for my Rocks";
                  loserMsg =  player1Nm + ": Rock this you clown";
                  return "Rock crushes Scissors - " + player2Nm + " Wins";
          } else {

          //  Scissors beats Paper
          if (ans2 == "Scissors" && ans1 === "Paper") {
                  player2Wins ++;
                  player1Losses ++;
                  updatePlayer();
                  winnerMsg = player2Nm + ": You lost again Paper clown";
                  loserMsg =  player1Nm + ": I'm tired of you SCISSORS girl";
                  return "Scissors cuts Paper - " + player2Nm + " Wins";
          } else {

          //  Paper beats Rock
          if (ans2 == "Paper" && ans1 === "Rock") {
                  player2Wins ++;
                  player1Losses ++;
                  updatePlayer();
                  winnerMsg = player2Nm + ": I taunt you Rock boy";
                  loserMsg =  player1Nm + ": Papers are FAKE NEWS";
                  return "Paper covers Rock - " + player2Nm + " Wins";
          } else {

          // tie game
          if (ans1 == ans2)  {
              
                  player1Ties ++;
                  player2Ties ++;
                  updatePlayer();
                  winnerMsg = player2Nm + ": TIES are stupid";
                  loserMsg =  player1Nm + ": At Least we agree on something Dude";
                  return "TIE GAME";
                  }
                }
              }
            }
          }
        } 
      } 
    };

    // hide buttons on inital load
    $('#new-players').hide();

    // onclick listerners for adding Rock/Paper/Scissors to answer div
    $(document).on("click", ".player1", setPlayers);
    $(document).on("click", ".player2", setPlayers);
    // on click to change players
    $(document).on("click", "#new-players", changePlayers);
 

