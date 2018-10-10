
( function() {

  // Game state variables
  const width = 8, height = 8;
  var player = "X";
  var Xleft = 12;
  var Oleft = 12;
  var turn = 1;

// MAKE ARRAY OF CELL STATUSES - runs on server side at game start
function createBoardArray() {
  var boardStatus = [];
    for (var y = 0; y < height; y++){
      var row = [];
      for (var x = 0; x<width; x++){
        //even row, even cell = white (0)
        if ((y%2 == 0) && (x%2 ==0)){
        row.push("0");
        }
        //even row, odd cell = black (1)
        else if ((y%2 == 0) && (x%2 > 0)){
        row.push("1");
        }
        //odd row, even cell = black
        else if ((y%2 > 0) && (x%2 == 0)){
        row.push("1");
        }
        //odd row, odd cell = white
        else if ((y%2 > 0) && (x%2 > 0)){
        row.push("0");
        }
      }
      boardStatus.push(row);
    }
    console.log("Board at array generation:")
    console.log(boardStatus);
    return boardStatus;
  };


//PLACE CHECKERS - also runs serverside at game start
function startPieces(){
  //make checker objects
  var boardStatus = createBoardArray();
  //amending status of white squares in first 3 rows
  for (var y = 0; y < 3; y++){
    for (var x = 0; x < boardStatus[y].length; x++) {
      if (boardStatus[y][x] == 0){
        boardStatus[y][x] = "X";;
      }
    }
  }
  //and in last 3 rows
  for (var y = 5; y < 8; y++){
    for (var x = 0; x < boardStatus[y].length; x++) {
      if (boardStatus[y][x] == 0){
        boardStatus[y][x] = "O";;
      }
    }
  }
  console.log("board at initial population");
  console.log(boardStatus);
  return boardStatus;
};

//code to be exported to be run by api
let exports = {
                startPieces: startPieces}

if ( typeof __dirname == 'undefined')       // Running in browser
    window.exports = exports;
else                                        // Running in node.js
    module.exports = exports;

}())
