let board;
const humanPlayer = 'X';
const aiPlayer = 'O';
const winMoves = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [6, 4, 2],
    [2, 5, 8],
    [1, 4, 7],
    [0, 3, 6]
];

const cells = document.querySelectorAll(".cell");
begin();

function begin () {
    document.querySelector(".endgame").style.display = "none";
    board = Array.from(Array(9).keys());
    for(var i=0; i<cells.length; i++)
    {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click',turnClick,false);
    }
}
    function turnClick(square){
        // console.log(square.target.id);
        if(typeof board[square.target.id] == 'number') {
            turn(square.target.id, humanPlayer);
            if(!checkTie()) turn(bestSpot(),aiPlayer);
        }
    }

    function turn(squareId, player){
        board[squareId] = player;
        document.getElementById(squareId).innerText = player; 
        let gameWon = checkWinner(board,player);
        if (gameWon) gameEnd(gameWon);

    }

    function checkWinner(board,player){
        let plays = board.reduce((a,e,i) => (e === player) ? a.concat(i) : a, []);
        let gameWon = null;
        for (let [index, win] of winMoves.entries()) {
            if (win.every(elem => plays.indexOf(elem) > -1)) {
              gameWon = {index: index, player: player};
              break;
            }
        }
        return gameWon;
    }

    function gameEnd(gameWon) {
        for (let index of winMoves[gameWon.index]) {
            document.getElementById(index).style.backgroundColor = gameWon.player == humanPlayer ? "blue" : "red";
        }
        for (let i = 0; i< cells.length; i++) {
            cells[i].removeEventListener('click', turnClick,false);
        }
        declareWinner(gameWon.player === humanPlayer ? "You win!" : "You lose");
    }

        function declareWinner (who) {
            document.querySelector(".endgame").style.display ="block";
            document.querySelector(".endgame .text").innerText = who;
    
         }
    function emptyCells(){
        return board.filter(s => typeof s == 'number');
    }

    function bestSpot() {
        // return emptyCells()[0];
        return minmax(board, aiPlayer).index;
    }

    function checkTie() {
        if (emptyCells().length == 0) {
            for(let i =0; i < cells.length; i++) {
                cells[i].style.backgroundColor = "green";
                cells[i].removeEventListener('click', turnClick,false);
            }
            declareWinner("Tie Game!") 
            return true;
        }
        return false;
    }

    function minmax(newBoard, player) {
        var availSpots = emptyCells(newBoard);
        
        if (checkWinner(newBoard, humanPlayer)) {
          return {score: -10};
        } else if (checkWinner(newBoard, aiPlayer)) {
          return {score: 10};
        } else if (availSpots.length === 0) {
          return {score: 0};
        }
        
        var moves = [];
        for (let i = 0; i < availSpots.length; i ++) {
          var move = {};
          move.index = newBoard[availSpots[i]];
          newBoard[availSpots[i]] = player;
          
          if (player === aiPlayer)
            move.score = minmax(newBoard, humanPlayer).score;
          else
             move.score =  minmax(newBoard, aiPlayer).score;
          newBoard[availSpots[i]] = move.index;
          if ((player === aiPlayer && move.score === 10) || (player === humanPlayer && move.score === -10))
            return move;
          else 
            moves.push(move);
        }
        
        let bestMove, bestScore;
        if (player === aiPlayer) {
          bestScore = -1000;
          for(let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
              bestScore = moves[i].score;
              bestMove = i;
            }
          }
        } else {
            bestScore = 1000;
            for(let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
              bestScore = moves[i].score;
              bestMove = i;
            }
          }
        }
        return moves[bestMove];
      }