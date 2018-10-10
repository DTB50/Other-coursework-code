//ENABLE USER TO PLAY GAME
(function() {
//set up all game variables needed on client side
    const width = 8, height = 8;
    var thisPlayer;
    var team;
    var player;
    var Xleft = 12;
    var Oleft = 12;
    var turn;
    var currentxpos = 9;
    var currentypos = 9;
    var pieceSelected = false;
    var selectedCellID;
    var selectedxpos;
    var selectedypos;
    var selectedHTML;
    var intendedCellID;
    var intendedxpos;
    var intendedypos;
    var intendedHTML;
    var validMove;
    var jumpedBlue = false;
    var jumpedRed = false;
    var jumpedx;
    var jumpedy;
    var win = false;
    var winner;

//////////////////////////////////////////////////////////////////////////////
//  SETUP GAME INITIALLY
/////////////////////////////////////////////////////////////////////////////
// $( function() {
//   createBoard();
// });
//ON PAGE LOAD, GIVE PLAYER OPTION TO START GAME
  $( function() {
      console.log("Page loaded");
      $('#submit').click(startGame);
      $('#buttonReStartGame').click(restartGame);
  });

//START GAME - assign players and pull initial board data from server
  function startGame(){
    //package up user data and send it serverside, then pull it back and update the game accordingly
    thisPlayerName = $('#playerName').val();
    var playerID = {
      "playerName": thisPlayerName,
    };
    fetch('/userLogin', {
      method: 'POST',
      headers : new Headers({'Content-Type': 'application/json'}),
      body:JSON.stringify(playerID)
    })
    .then(res => res.json())            //converts response to JSON data
    .then(data => unpackUserData(data))   //updates user data and displays as necessary
    .catch(err => console.log(err))
  };

//GET GAME STATE FROM SERVER
  function getGameState () {
    $('#waiting').html("Waiting for board update... Please don't touch anything!");
    fetch('/getGameState')
      .then(res => res.json())            //converts response to JSON data
      .then(data => unpackGameState(data))   //displays the board based on array data
      .catch(err => console.log(err))
  };

  //OPENS UP USER DATA OBJECT
      function unpackUserData (data) {
        console.log("user data recieved");
        console.log(data);
        userData = data;
        thisPlayer = userData.playerTeam;
        playerName = userData.playerName;
        $('#playerID').html("Your name is " + playerName + " and you are on team " + thisPlayer);
        //clear user entry box
        $('#startInfo').empty();
        //pull data from server
        getGameState();
      };

//RELOAD PAGE
  function restartGame(){
    location.reload();
  };

//////////////////////////////////////////////////////////////////////////////////////////
//MAIN GAME LOGIC
//////////////////////////////////////////////////////////////////////////////////////////

//FOR ACTIVE PLAYER: BUILD TABLE BASED ON ARRAY (ALLOW MOVES)- bring in BoardStatus from server
  function createBoard(boardStatus) {
    var boardStatus = boardStatus;
    validMove = false;
    jumpedBlue = false;
    jumpedRed = false;
    $('#waiting').empty();
    $('#board').empty();
    //make table
      let table = $('<table></table>').css('border','1px solid black').css('border-collapse', 'collapse');
    //make row
    var cellID = 1;
      for(let y=0; y < boardStatus.length; y++) {
          let row = $('<tr></tr>');
    //make squares to fill rows
          for(let x=0; x < boardStatus[y].length; x++) {
            //make a blank white square
              if (boardStatus[y][x] == 0) {
                let col = $('<td></td>');
                col.attr("id", cellID);
                col.attr("class", "whiteSquare")
                col.html('_');
                col.attr('xpos', x);
                col.attr('ypos', y);
                col.click(function() {
                  var currentCellID = $(this).attr("id");
                  currentxpos = $(this).attr("xpos");
                  currentypos = $(this).attr("ypos");
                  var currentHTML = $(this).html();
                  move(currentCellID, currentxpos, currentypos, currentHTML, boardStatus);
                });
                row.append(col);
                cellID++;
              }
            //make a blank black square
              else if (boardStatus[y][x] == 1) {
                let col = $('<td></td>');
                col.attr("id", cellID);
                col.attr("class", "blackSquare")
                col.attr('xpos', x);
                col.attr('ypos', y);
                col.html('_');
                row.append(col);
                cellID++;
              }
            //make a white square with red X checker
             else if (boardStatus[y][x] == "X") {
                let col = $('<td></td>');
                col.attr("id", cellID);
                col.attr("class", "whiteSquareXred");
                col.html('X');
                col.attr('xpos', x);
                col.attr('ypos', y);
                col.click(function() {
                  var currentCellID = $(this).attr("id");
                  currentxpos = $(this).attr("xpos");
                  currentypos = $(this).attr("ypos");
                  var currentHTML = $(this).html();
                  move(currentCellID, currentxpos, currentypos, currentHTML, boardStatus);
                });
                row.append(col);
                cellID++;
              }
            //make a white square with blue O checker
              else if (boardStatus[y][x] == "O") {
                 let col = $('<td></td>');
                 col.attr("id", cellID);
                 col.attr("class", "whiteSquareOblue");
                 col.html('O');
                 col.attr('xpos', x);
                 col.attr('ypos', y);
                 col.click(function() {
                   var currentCellID = $(this).attr("id");
                   currentxpos = $(this).attr("xpos");
                   currentypos = $(this).attr("ypos");
                   var currentHTML = $(this).html();
                   move(currentCellID, currentxpos, currentypos, currentHTML, boardStatus);
                 });
                 row.append(col);
                 cellID++;
               }
               //make a white square with blue king O checker
                 else if (boardStatus[y][x] == "|O|") {
                    let col = $('<td></td>');
                    col.attr("id", cellID);
                    col.attr("class", "whiteSquareOkingblue");
                    col.html('|O|');
                    col.attr('xpos', x);
                    col.attr('ypos', y);
                    col.click(function() {
                      var currentCellID = $(this).attr("id");
                      currentxpos = $(this).attr("xpos");
                      currentypos = $(this).attr("ypos");
                      var currentHTML = $(this).html();
                      move(currentCellID, currentxpos, currentypos, currentHTML, boardStatus);
                    });
                    row.append(col);
                    cellID++;
                  }
                  //make a white square with red king X checker
                    else if (boardStatus[y][x] == "|X|") {
                       let col = $('<td></td>');
                       col.attr("id", cellID);
                       col.attr("class", "whiteSquareXkingred");
                       col.html('|X|');
                       col.attr('xpos', x);
                       col.attr('ypos', y);
                       col.click(function() {
                         var currentCellID = $(this).attr("id");
                         currentxpos = $(this).attr("xpos");
                         currentypos = $(this).attr("ypos");
                         var currentHTML = $(this).html();
                         move(currentCellID, currentxpos, currentypos, currentHTML, boardStatus);
                       });
                       row.append(col);
                       cellID++;
                     }
          }
          table.append(row);
      }
      //Put it together
      $('#board').append(table);
      $('#Xscore').html("Player X score is " + (12-Oleft));
      $('#Oscore').html("Player O score is " + (12-Xleft));
      $('#playerTurn').html("Turn is: " + turn + ". Current Player is " + player);
    }

//FOR WAITING PLAYER: BUILD TABLE BASED ON ARRAY (DISALLOW MOVES) - refresh often
    function createBoardAndWait(boardStatus) {
      var boardStatus = boardStatus;
      validMove = false;
      jumpedBlue = false;
      jumpedRed = false;
      $('#waiting').empty();
      $('#waiting').html("Waiting for opponent's move...");
      $('#board').empty();
      //make table
        let table = $('<table></table>').css('border','1px solid black').css('border-collapse', 'collapse');
      //make row
      var cellID = 1;
        for(let y=0; y < boardStatus.length; y++) {
            let row = $('<tr></tr>');
      //make squares to fill rows
            for(let x=0; x < boardStatus[y].length; x++) {
              //make a blank white square
                if (boardStatus[y][x] == 0) {
                  let col = $('<td></td>');
                  col.attr("id", cellID);
                  col.attr("class", "whiteSquare")
                  col.html('_');
                  col.attr('xpos', x);
                  col.attr('ypos', y);
                  col.click(function() {
                    var currentCellID = $(this).attr("id");
                    currentxpos = $(this).attr("xpos");
                    currentypos = $(this).attr("ypos");
                    var currentHTML = $(this).html();
                  });
                  row.append(col);
                  cellID++;
                }
              //make a blank black square
                else if (boardStatus[y][x] == 1) {
                  let col = $('<td></td>');
                  col.attr("id", cellID);
                  col.attr("class", "blackSquare")
                  col.attr('xpos', x);
                  col.attr('ypos', y);
                  col.html('_');
                  row.append(col);
                  cellID++;
                }
              //make a white square with red X checker
               else if (boardStatus[y][x] == "X") {
                  let col = $('<td></td>');
                  col.attr("id", cellID);
                  col.attr("class", "whiteSquareXred");
                  col.html('X');
                  col.attr('xpos', x);
                  col.attr('ypos', y);
                  col.click(function() {
                    var currentCellID = $(this).attr("id");
                    currentxpos = $(this).attr("xpos");
                    currentypos = $(this).attr("ypos");
                    var currentHTML = $(this).html();
                  });
                  row.append(col);
                  cellID++;
                }
              //make a white square with blue O checker
                else if (boardStatus[y][x] == "O") {
                   let col = $('<td></td>');
                   col.attr("id", cellID);
                   col.attr("class", "whiteSquareOblue");
                   col.html('O');
                   col.attr('xpos', x);
                   col.attr('ypos', y);
                   col.click(function() {
                     var currentCellID = $(this).attr("id");
                     currentxpos = $(this).attr("xpos");
                     currentypos = $(this).attr("ypos");
                     var currentHTML = $(this).html();
                   });
                   row.append(col);
                   cellID++;
                 }
                 //make a white square with blue king O checker
                   else if (boardStatus[y][x] == "|O|") {
                      let col = $('<td></td>');
                      col.attr("id", cellID);
                      col.attr("class", "whiteSquareOkingblue");
                      col.html('|O|');
                      col.attr('xpos', x);
                      col.attr('ypos', y);
                      col.click(function() {
                        var currentCellID = $(this).attr("id");
                        currentxpos = $(this).attr("xpos");
                        currentypos = $(this).attr("ypos");
                        var currentHTML = $(this).html();
                      });
                      row.append(col);
                      cellID++;
                    }
                    //make a white square with red king X checker
                      else if (boardStatus[y][x] == "|X|") {
                         let col = $('<td></td>');
                         col.attr("id", cellID);
                         col.attr("class", "whiteSquareXkingred");
                         col.html('|X|');
                         col.attr('xpos', x);
                         col.attr('ypos', y);
                         col.click(function() {
                           var currentCellID = $(this).attr("id");
                           currentxpos = $(this).attr("xpos");
                           currentypos = $(this).attr("ypos");
                           var currentHTML = $(this).html();
                         });
                         row.append(col);
                         cellID++;
                       }
            }
            table.append(row);
        }
      //Put it all together
        $('#board').append(table);
        $('#Xscore').html("Player X score is " + (12-Oleft));
        $('#Oscore').html("Player O score is " + (12-Xleft));
        $('#playerTurn').html("Turn is: " + turn + ". Current Player is " + player);

      //REQUEST UPDATE EVERY 3 SECONDS
        setTimeout(function() {
        console.log("checking for new game state...");
        getGameState();
      }, 3000);
    }

//MOVE CELLS
  function move(currentCellID, currentxpos, currentypos, currentHTML, boardStatus) {
    //USER SELECTS A CHECKER TO PLACE IT (IF NONE CURRENTLY SELECTED)
      if (pieceSelected == false){
      //assign variables for selected cell
      selectedCellID = currentCellID;
      selectedxpos = currentxpos;
      selectedypos = currentypos;
      selectedHTML = currentHTML;
      //only proceed if player has selected own piece - if not, require them to choose again
      if (player == "X" && (selectedHTML == "X" || selectedHTML == "|X|")) {
          console.log("correct player X piece selected");
      }
      else if (player == "O" && (selectedHTML == "O" || selectedHTML == "|O|")){
          console.log("correct player O piece selected");
      }
      else if (player == "O" && (selectedHTML == "X" || selectedHTML == "|X|")){
          console.log("player O has chosen an invalid piece");
          pieceSelected = false;
          console.log("You cannot select this piece");
          return;
      }
      else if (player == "X" && (selectedHTML == "O" || selectedHTML == "|O|")){
          console.log("player O has chosen an invalid piece");
          pieceSelected = false;
          console.log("You cannot select this piece");
          return;
      }
      else if (selectedHTML == '_') {
            pieceSelected = false;
            console.log("Square without piece selected");
            return;
        }
      var selectedChecker = "#" + selectedCellID;
        console.log(selectedChecker);
      $(selectedChecker).css("background-color", "yellow");
      pieceSelected = true;
    }
  //IF A CHECKER IS SELECTED, USER CHOOSES WHERE TO PLACE IT
    else if (pieceSelected == true) {
      //assign variables for intended cell
      intendedCellID = currentCellID;
      intendedxpos = currentxpos;
      intendedypos = currentypos;
      intendedHTML = currentHTML;
    //VALIDATE MOVE - if valid, update board. If not, do not update;
      console.log("checking validity using selectedHTML = " + selectedHTML + ", intendedHTML =:" + intendedHTML + ", selectedxpos = " + selectedxpos + " and selectedypos = " + selectedypos);
      selectedxpos = parseInt(selectedxpos);
      selectedypos = parseInt(selectedypos);
      intendedxpos = parseInt(intendedxpos);
      intendedypos = parseInt(intendedypos);

      //for red X checkers -
      if (selectedHTML == "X") {
        //coordinate comparison variables
          validxL = selectedxpos-1;
          validxR = selectedxpos+1;
          validy = selectedypos+1;

          validjumpxR = selectedxpos+2;
          validjumpxL = selectedxpos-2;
          validjumpy = selectedypos+2;

            //normal move down right or left
            if ((intendedxpos == validxR || intendedxpos == validxL) && (intendedypos == validy) && (intendedHTML != "X" && intendedHTML !="O" && intendedHTML != "|O|" && intendedHTML != "|X|")){
              validMove = true;
            }
            //jump down right over blue square
            else if (((intendedxpos == validjumpxR && intendedypos == validjumpy)) && (intendedHTML != "X" && intendedHTML !="O") && (boardStatus[validy][validxR] == "O" || boardStatus[validy][validxR] == "|O|")) {
              jumpedBlue = true;
              jumpedx = validxR;
              jumpedy = validy;
              validMove = true;
            }
            //jump down left over blue square
            else if (((intendedxpos == validjumpxL && intendedypos == validjumpy)) && (intendedHTML != "X" && intendedHTML !="O") && (boardStatus[validy][validxL] == "O" || boardStatus[validy][validxL] == "|O|")) {
              jumpedBlue = true;
              jumpedx = validxL;
              jumpedy = validy;
              validMove = true;
            }
            //deselect piece if user reselects the same piece
            else if ((intendedxpos == selectedxpos) && (intendedypos == selectedypos)){
              pieceSelected = false;
              console.log("piece deselected: select again");
              var selectedChecker = "#" + selectedCellID;
              $(selectedChecker).css("background-color", "white");
              validMove = false;
              }
            else {
              validMove = false;
            }
        }
      //for red X kings
      else if (selectedHTML == "|X|") {
        //comparison coordinates
          validxL = selectedxpos-1;
          validxR = selectedxpos+1;
          validy = selectedypos+1;
          validyup = selectedypos-1;

          validjumpxR = selectedxpos+2;
          validjumpxL = selectedxpos-2;
          validjumpy = selectedypos+2;
          validjumpyup = selectedypos-2;

            //normal move down one square left or right
            if ((intendedxpos == validxR || intendedxpos == validxL) && (intendedypos == validy) && (intendedHTML != "X" && intendedHTML !="O" && intendedHTML != "|O|" && intendedHTML != "|X|")){
              validMove = true;
            }
            //normal move up one square left or right
            else if ((intendedxpos == validxR || intendedxpos == validxL) && (intendedypos == validyup) && (intendedHTML != "X" && intendedHTML !="O" && intendedHTML != "|O|" && intendedHTML != "|X|")){
              validMove = true;
            }
            //jump right down over blue piece - if intended space is two y away and two x away, AND there's nothing in the intended space AND there's a blue piece in between the selected piece and intended space
            else if (((intendedxpos == validjumpxR && intendedypos == validjumpy)) && (intendedHTML != "X" && intendedHTML !="O" && intendedHTML != "|O|" && intendedHTML != "|X|") && (boardStatus[validy][validxR] == "O" || boardStatus[validy][validxR] == "|O|")) {
              jumpedBlue = true;
              jumpedx = validxR;
              jumpedy = validy;
              validMove = true;
            }
            //jump left down over blue piece
            else if (((intendedxpos == validjumpxL && intendedypos == validjumpy)) && (intendedHTML != "X" && intendedHTML !="O" && intendedHTML != "|O|" && intendedHTML != "|X|") && (boardStatus[validy][validxL] == "O" || boardStatus[validy][validxL] == "|O|")) {
              jumpedBlue = true;
              jumpedx = validxL;
              jumpedy = validy;
              validMove = true;
            }
            //jump right up over blue piece or king
            else if (((intendedxpos == validjumpxR && intendedypos == validjumpyup)) && (intendedHTML != "X" && intendedHTML !="O" && intendedHTML != "|O|" && intendedHTML != "|X|") && (boardStatus[validyup][validxR] == "O" || boardStatus[validyup][validxR] == "|O|")) {
              jumpedBlue = true;
              jumpedx = validxR;
              jumpedy = validyup;
              validMove = true;
            }
            //jump left up over blue piece
            else if (((intendedxpos == validjumpxL && intendedypos == validjumpyup)) && (intendedHTML != "X" && intendedHTML !="O" && intendedHTML != "|O|" && intendedHTML != "|X|") && (boardStatus[validyup][validxL] == "O" || boardStatus[validyup][validxL] == "|O|")) {
              jumpedBlue = true;
              jumpedx = validxL;
              jumpedy = validyup;
              validMove = true;
            }
            //deselect if clicked twice in a row
            else if ((intendedxpos == selectedxpos) && (intendedypos == selectedypos)){
              pieceSelected = false;
              console.log("piece deselected: select again");
              var selectedChecker = "#" + selectedCellID;
              $(selectedChecker).css("background-color", "white");
              validMove = false;
              }
            else {
              validMove = false;
            }
        }
      //for blue checkers
        else if (selectedHTML == "O") {
          //coordinate comparison variables
            validxL = selectedxpos-1;
            validxR = selectedxpos+1;
            validy = selectedypos-1;

            validjumpxR = selectedxpos+2;
            validjumpxL = selectedxpos-2;
            validjumpy = selectedypos-2;

              //normal move up left or right
              if ((intendedxpos == validxR || intendedxpos == validxL) && (intendedypos == validy) && (intendedHTML != "X" && intendedHTML !="O" && intendedHTML != "|O|" && intendedHTML != "|X|")){
                validMove = true;
              }
              //jump right up over red square
              else if (((intendedxpos == validjumpxR && intendedypos == validjumpy)) && (intendedHTML != "X" && intendedHTML !="O") && (boardStatus[validy][validxR] == "X" || boardStatus[validy][validxR] == "|X|")) {
                jumpedRed = true;
                jumpedx = validxR;
                jumpedy = validy;
                validMove = true;
              }
              //jump left up over red square
              else if (((intendedxpos == validjumpxL && intendedypos == validjumpy)) && (intendedHTML != "X" && intendedHTML !="O") && (boardStatus[validy][validxL] == "X" || boardStatus[validy][validxL] == "|X|")) {
                jumpedRed = true;
                jumpedx = validxL;
                jumpedy = validy;
                validMove = true;
              }
              //deselect if clicked twice in a row
              else if ((intendedxpos == selectedxpos) && (intendedypos == selectedypos)){
                pieceSelected = false;
                console.log("piece deselected: select again");
                var selectedChecker = "#" + selectedCellID;
                $(selectedChecker).css("background-color", "white");
                validMove = false;
                }
              else {
                validMove = false;
              }
            }
        //for blue kings
        else if (selectedHTML == "|O|") {
        //coordinate comparison variables
        validxL = selectedxpos-1;
        validxR = selectedxpos+1;
        validy = selectedypos-1;
        validydown = selectedypos+1;

        validjumpxR = selectedxpos+2;
        validjumpxL = selectedxpos-2;
        validjumpy = selectedypos-2;
        validjumpydown = selectedypos+2;

        //regular move up left or right by one square
          if ((intendedxpos == validxR || intendedxpos == validxL) && (intendedypos == validy) && (intendedHTML != "X" && intendedHTML !="O" && intendedHTML != "|O|" && intendedHTML != "|X|")){
            validMove = true;
          }
          //jump up right over red piece or king
          else if (((intendedxpos == validjumpxR && intendedypos == validjumpy)) && (intendedHTML != "X" && intendedHTML !="O"  && intendedHTML != "|O|" && intendedHTML != "|X|") && (boardStatus[validy][validxR] == "X" || boardStatus[validy][validxR] == "|X|")) {
            jumpedRed = true;
            jumpedx = validxR;
            jumpedy = validy;
            validMove = true;
          }
          //jump up left over red piece or king
          else if (((intendedxpos == validjumpxL && intendedypos == validjumpy)) && (intendedHTML != "X" && intendedHTML !="O" && intendedHTML != "|O|" && intendedHTML != "|X|") && (boardStatus[validy][validxL] == "X" || boardStatus[validy][validxL] == "|X|")) {
            jumpedRed = true;
            jumpedx = validxL;
            jumpedy = validy;
            validMove = true;
          }
         //jump down right over red piece or king
          else if (((intendedxpos == validjumpxR && intendedypos == validjumpydown)) && (intendedHTML != "X" && intendedHTML !="O"  && intendedHTML != "|O|" && intendedHTML != "|X|") && (boardStatus[validydown][validxR] == "X" || boardStatus[validydown][validxR] == "|X|")) {
            jumpedRed = true;
            jumpedx = validxR;
            jumpedy = validydown;
            validMove = true;
          }
          //jump down left over red piece or king
          else if (((intendedxpos == validjumpxL && intendedypos == validjumpydown)) && (intendedHTML != "X" && intendedHTML !="O" && intendedHTML != "|O|" && intendedHTML != "|X|") && (boardStatus[validydown][validxL] == "X" || boardStatus[validydown][validxL] == "|X|")) {
            jumpedRed = true;
            jumpedx = validxL;
            jumpedy = validydown;
            validMove = true;
          }
        //regular move down left or right by one square
          else if ((intendedxpos == validxR || intendedxpos == validxL) && (intendedypos == validydown) && (intendedHTML != "X" && intendedHTML !="O" && intendedHTML != "|O|" && intendedHTML != "|X|")){
            validMove = true;
          }
          //deselect if clicked twice in a row
          else if ((intendedxpos == selectedxpos) && (intendedypos == selectedypos)){
              pieceSelected = false;
              console.log("piece deselected: select again");
              var selectedChecker = "#" + selectedCellID;
              $(selectedChecker).css("background-color", "white");
              validMove = false;
            }
          else {
            validMove = false;
          }
        }
  //ACTUALLY UPDATE BOARD AFTER MOVE
        if(validMove == true){
        boardUpdate(boardStatus, selectedHTML, intendedHTML, selectedxpos, selectedypos, intendedxpos, intendedypos, jumpedRed, jumpedBlue);
        }
        else {
        console.log("invalid move");
        }
      }
  };


//UPDATE BOARD CONTROL ARRAYS AFTER PLAYER MOVE, SEND TO SERVER, AND RETRIEVE BACK FROM SERVER
  function boardUpdate(boardStatus, selectedHTML, intendedHTML, selectedxpos, selectedypos, intendedxpos, intendedypos, jumpedRed, jumpedBlue) {
  //switch pieces as player specifies
    var tempStore = boardStatus[intendedypos][intendedxpos];
    boardStatus[intendedypos][intendedxpos] = boardStatus[selectedypos][selectedxpos];
    boardStatus[selectedypos][selectedxpos] = tempStore;
  //remove any jumped pieces
    if (jumpedRed == true){
      boardStatus[jumpedy][jumpedx] = "0";
      Xleft--;
      jumpedRed = false;
    }
    if (jumpedBlue == true){
      boardStatus[jumpedy][jumpedx] = "0";
      Oleft--;
      jumpedBlue = false;
    }
  //check for newly crowned kings
    checkKing(boardStatus);
  //update round control variables - new turn, swap active player
    turn++;
    thisPlayer = player;
      if (player == "X") {
          player = "O";
      }
      else if (player == "O") {
          player = "X";
      }
  pieceSelected = false;
  //SERVER CALLS
  //Create a move object
  var gameState = {
    "boardStatus": boardStatus,
    "turn":  turn,
    "thisPlayer": thisPlayer,
    "player" : player,
    "Xleft" : Xleft,
    "Oleft" : Oleft
   };
   console.log(JSON.stringify(gameState));

  updateGame(boardStatus, gameState);

  };

//CHECK IF ANY CHECKERS SHOULD BECOME KINGS
  function checkKing(boardStatus) {
      //if there is a piece of the opposite side in the back row of one side, change that piece to a king
      //scan bottom row for red Xs and replace with kings
      for (var i = 7; i < height; i++) {
          for (var j = 0; j < width; j++) {
              if (boardStatus[i][j] == "X") {
                  boardStatus[i][j] = "|X|";
              }
          }
      }
      //scan top row for blue Os and replace with kings
      for (var i = 0; i < 1; i++) {
          for (var j = 0; j < width; j++) {
              if (boardStatus[i][j] == "O") {
                  boardStatus[i][j] = "|O|";
              }
          }
      }
  };

//UPDATE SERVER WITH NEW BOARD STATUS ARRAYS
  function updateGame(boardStatus, gameState){
    //Send updated board status to server api
      console.log("about to send state to server...");
       fetch('/updateGameState', {
         method: 'POST',
         headers : new Headers({'Content-Type': 'application/json'}),
         body:JSON.stringify(gameState)
       })
       .then(res => res.json())            //converts response to JSON data
       .then(data => unpackGameState(data))   //displays the board based on array data
       .catch(err => console.log(err))
    };

//PROCESS NEW GAME STATE
//IMPORTANT - PLAYER CONTROL SWITCH IS HERE
    function unpackGameState (data) {
      //update client variables from object
        console.log("Game state variables recieved");
        console.log(typeof data);
        console.log(data);
        gameState = data;
        console.log("at start of turn " + gameState.turn);
        turn = gameState.turn;
        console.log("boardStatus is now = " + gameState.boardStatus);
        boardStatus = gameState.boardStatus;
        console.log("current player to move will be " + gameState.player);
        player = gameState.player;
        console.log("Xleft = " + gameState.Xleft);
        Xleft = gameState.Xleft;
        console.log("Oleft = " + gameState.Oleft);
        win = gameState.win;
        console.log("win is " + win);
        winner = gameState.winner;
        console.log("the winner is" + undefined);
      //update board with new board setup depending on whether the client is the active or non-active player
      if (win == true) {
        endGame(winner);
      }
      else if (win ==false) {
        if (thisPlayer == player){
          createBoard(boardStatus);
        }
        else if (thisPlayer != player) {
          createBoardAndWait(boardStatus);
        }
      }
    };


//DELETES BOARD AND INFORMS PLAYERS OF WINNER
    function endGame(winner) {
      console.log("endGame activated");
      $('#board').empty();
      $('#playerID').html(winner + " wins!");
      $('#Xscore').html("Player X score is " + (12-Oleft));
      $('#Oscore').html("Player O score is " + (12-Xleft));
      $('#playerTurn').empty();
      $('#waiting').empty();
    }

}());
