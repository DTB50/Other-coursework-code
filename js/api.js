/***********************************************************************************
 * RESTFUL API for Checkers game
 ***********************************************************************************/

var express = require('express');
var bodyParser = require('body-parser');
var game = require('./game.js');

var boardStatus;
var activePlayer = 'X';
var board;
var turn = 1;
var player;
var Xleft = 12;
var Oleft = 12;
var gameState;
var win = false;
var winner;

var Xassigned = false;
var Oassigned = false;
var lastPlayerName;
var lastPlayerTeam;
var playerXname;
var playerOname;

(function() {

    // We will hold our in-memory data in here
    var thePort;

    // Export the public methods of the module so we can run it from JS
    module.exports = {
        runApp: runApp,
        configureApp: configureApp,
    };

/***********************************************************************************
 * Express Application
 ***********************************************************************************/

//Run the app on port 8989
    function runApp() {

      game.startPieces();
        thePort = 8989;
        var app = express();
        configureApp(app);
        console.log("Listening on port " + thePort);
        app.listen(thePort);
    }
///////////////////////////////////////////////////////////////////////////////
//SERVER CONFIGURATION
///////////////////////////////////////////////////////////////////////////////
    function configureApp(app) {

      //parse anything submitted to server as JSON
      app.use(bodyParser.urlencoded({ extended: false }));
      app.use(bodyParser.json());

      //logs user name and assigns team
      app.post("/userLogin", userLogin);

      //current player logs new game state
      app.post("/updateGameState", updateGameState);

      //inactive player tries to get new game state
      app.get("/getGameState", getGameState);

      // base url: serve a static page from the "static" directory.
      app.use('/', express.static('static'));
    }

////////////////////////////////////////////////////////////////////////////////
//EVENT HANDLERS
////////////////////////////////////////////////////////////////////////////////


  //For active player - Update game state based on user's submission (and check for win)
   var updateGameState = function (req,res,next) {
     console.log("Game state variables");
     console.log(req.body);
     gameState = req.body;
     console.log("at start of turn " + gameState.turn);
     turn = gameState.turn;
     console.log("boardStatus is now = " + gameState.boardStatus);
     boardStatus = gameState.boardStatus;
     console.log("move was submitted by player " + gameState.thisPlayer);
     thisPlayer = gameState.thisPlayer;
     console.log("next player to move will be " + gameState.player);
     activePlayer = gameState.player;
     console.log("Xleft = " + gameState.Xleft);
     Xleft = gameState.Xleft;
     console.log("Oleft = " + gameState.Oleft);
     Oleft = gameState.Oleft;
     win =winCheck(Xleft, Oleft);
    //send initial board
     if (turn == 1) {
       console.log("first turn, setting up board");
       boardStatus =  game.startPieces();
       console.log(boardStatus)
       var gameState = {
         "boardStatus": boardStatus,
         "turn":  turn,
         "player" : activePlayer,
         "Xleft" : Xleft,
         "Oleft" : Oleft,
         "win" : win
        };
        console.log("sending initial gameState object:");
        console.log(gameState);
       res.send(JSON.stringify(gameState));
   //send all subsequent boards
     }
     else if (turn >= 2) {
       var gameState = {
         "boardStatus": boardStatus,
         "turn":  turn,
         "player" : activePlayer,
         "Xleft" : Xleft,
         "Oleft" : Oleft,
         "win" : win,
         "winner": winner
        };
     console.log("on turn" + turn + "sending back this gameState object: ");
     console.log(gameState);
     res.send(JSON.stringify(gameState));
     }
   }

   //For inactive player - Send back game state object to users
    var getGameState = function(req,res,next) {
    //send initialised board
      if (turn == 1) {
        console.log("first turn, setting up board");
        boardStatus =  game.startPieces();
        console.log(boardStatus)
        var gameState = {
          "boardStatus": boardStatus,
          "turn":  turn,
          "player" : activePlayer,
          "Xleft" : Xleft,
          "Oleft" : Oleft,
          "win" : win
         };
         console.log("sending initial gameState object:");
         console.log(gameState);
        res.send(JSON.stringify(gameState));
    //send all subsequent boards
      }
      else if (turn >= 2) {
        var gameState = {
          "boardStatus": boardStatus,
          "turn":  turn,
          "player" : activePlayer,
          "Xleft" : Xleft,
          "Oleft" : Oleft,
          "win" : win,
          "winner": winner
         };
      console.log("on turn" + turn + "sending back this gameState object: ");
      console.log(gameState);
      res.send(JSON.stringify(gameState));
      }
    }

  //login function - assigns player to a team (X or O)
    var userLogin = function (req,res,next) {
      var userData = req.body;
      //assign first player to X team
      if (Xassigned == false) {
        playerXname = userData.playerName;
        playerTeam = 'X';
        lastPlayerName = playerXname;
        lastPlayerTeam = playerTeam;
        Xassigned = true;
        var userData = {
          "playerName": lastPlayerName,
          "playerTeam": lastPlayerTeam
        }
        console.log("sending user data back to user:");
        console.log(userData);
        res.send(JSON.stringify(userData));
      }
      //assign second player to O team
      else if (Xassigned == true) {
        playerOname = userData.playerName;
        playerTeam = 'O';
        lastPlayerName = playerOname;
        lastPlayerTeam = playerTeam;
        Oassigned = true;
        var userData = {
          "playerName": lastPlayerName,
          "playerTeam": lastPlayerTeam
        }
        console.log("sending user data back to user:");
        console.log(userData);
        res.send(JSON.stringify(userData));
      }
    }

    //CHECK IF PLAYER HAS WON
    function winCheck (Xleft, Oleft) {
      console.log("winCheck is running with Xleft: " + Xleft + " and Oleft: " + Oleft);
        if(Xleft == 0){
          console.log("O wins");
          winner = playerOname;
            return true;
        }
        else if (Oleft == 0){
          console.log("X wins");
          winner = playerXname;
            return true;
        }
        else {
            console.log("no winners yet at X: " + Xleft + "and O: " + Oleft);
            return false;
        }
    };

})();
