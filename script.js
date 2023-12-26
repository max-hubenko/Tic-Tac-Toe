
function Gameboard() {
    let gameArray = [['','',''],['','',''],['','','']];
    let userTurn = true;
    let gameOver = false;
    let winner = null;

    function clearBoard() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                gameArray[i][j] = '';
                display.updateBoard(i,j,'');
                userTurn = true;
                gameOver = false;
                winner = null;
            }

        }
    }

    function isGameOver() {
        return gameOver;
    }

    function setUserTurn(turn) {
        userTurn = turn;
    }

    function getWinner() {
        return winner;
    }

    function getUserTurn() {
        return userTurn;
    }

    function showBoard() {
            console.log(gameArray[0])
            console.log(gameArray[1])
            console.log(gameArray[2])
    }

    function checkGameTie() {
        let totalMoves = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (gameArray[i][j] != '') {
                    totalMoves++;
                }
            }
        }
        if (totalMoves == 9) {
            gameOver = true;
        }
    }

    function checkGameWin() {
        for (let i = 0; i < 3; i++) {
            //Check if won by row
            if ((gameArray[i][0] == gameArray[i][1]) && (gameArray[i][1] == gameArray[i][2]) && (gameArray[i][0] != '')) {
                gameOver = true;
                winner = gameArray[i][0]
            }

            //Check if won by col
            if ((gameArray[0][i] == gameArray[1][i]) && (gameArray[1][i] == gameArray[2][i]) && (gameArray[0][i] != '')) {
                gameOver = true;
                winner = gameArray[0][i]

            }

            //Check diagonal

            if ((gameArray[0][0] == gameArray[1][1]) && (gameArray[1][1] == gameArray[2][2]) && (gameArray[0][0] != '')) {
                gameOver = true;
                winner = gameArray[0][0]
            }

            if ((gameArray[2][0] == gameArray[1][1]) && (gameArray[1][1] == gameArray[0][2]) && (gameArray[2][0] != '')) {
                gameOver = true;
                winner = gameArray[1][1]
            }
        }
    }

    function doMove(row,col,symbol) {
        if (gameArray[row][col] != '') {
            return false;
        }
        gameArray[row][col] = symbol;
        display.updateBoard(row,col,symbol);
        checkGameTie()
        checkGameWin()

        if (isGameOver()) {
            let message = '';
            showBoard();
            if (getWinner() == null) {
                message += "Tie";
            } else {
                message += getWinner() + " is the winner!";
            }
            console.log("Game Over");

            display.endGameDialog(message)
            return false;
        }
        return true;

    }
    

    return {gameArray,getUserTurn,isGameOver,getWinner,showBoard,doMove,clearBoard,setUserTurn};
}


function displayController() {
    let tiles = document.querySelectorAll('.tile');

    tiles.forEach(tile => {
        tile.addEventListener('click', function(event) {
            if (!game.isGameOver()) {
                let tileID = event.target.id;
                let [row, col] = tileID.split('').map(Number);
                user.makeMove(row, col);
            }

        });
    })

    function updateBoard(row,col,symbol) {
        let id = `${row}${col}`;
        console.log(id);
        let tile = document.getElementById(id); 
        tile.firstChild.innerHTML = symbol;
    }


    function endGameDialog(message) {
        let dialog = document.getElementById("winDialog");
        let closeButton = document.getElementById("closeWinDialog");
        let p = dialog.querySelector('p');
        p.innerHTML = message.toUpperCase();
        dialog.showModal();

        closeButton.addEventListener("click", () => {
            dialog.close();
          });
    }
    return {updateBoard, endGameDialog}
}

function userPlayer() {
    let symbol = 'x';

    function makeMove(row,col) {
        if (game.getUserTurn()) {
            if (game.doMove(row,col,this.symbol)) {
                game.setUserTurn(false); 
                if(game.isGameOver() == false) {
                computer.makeMove();
                }
            }
        }

    }

    return {symbol, makeMove};

}

function computerPlayer() {
    let symbol = 'o';


    function randomRowCol() {
        let row = Math.floor(Math.random() * 3); // Random integer between 0 and 2
        let col = Math.floor(Math.random() * 3); // Random integer between 0 and 2
        return [row,col];
    }


    function makeMove() {
        let rowcol = randomRowCol();
        setTimeout(() => {
            if (game.isGameOver() == false) {
                if (game.doMove(rowcol[0],rowcol[1],this.symbol)) {
                    game.setUserTurn(true);
                    game.showBoard() 
                }  
                else if (game.isGameOver() == false) {
                    this.makeMove();
                }
            }
        }, 600);
    }

    return {symbol, makeMove};
}

const game = Gameboard();
const user = userPlayer();
const computer = computerPlayer();
const display = displayController();


game.showBoard()




