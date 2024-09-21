const gameBoard = (() => {
    const row = 3;
    const col = 3;
    const board = Array.from({ length: 3 }, () => ["", "", ""]);

    const resetBoard = () => {
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                board[i][j] = "";
            }
        }
    };

    const getBoard = () => board;

    const positionToRowCol = (position) => {
        const row = Math.floor(position / 3);
        const col = Math.floor(position % 3);
        return { row, col };
    };

    const placeMarker = (marker, position) => {
        position = positionToRowCol(position);
        const { row, col } = position;
        if (board[row][col] === "") {
            board[row][col] = marker;
            return true;
        } else {
            return false;
        }
    };

    const isFull = () => {
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                if (board[i][j] == "") {
                    return false;
                }
            }
        }
        return true;
    };

    return { getBoard, isFull, placeMarker, resetBoard };
})();

const displayController = (() => {
    const displayBoard = (board) => {
        board.forEach(row => {
            console.log(row.map(cell => (cell === "" ? "_" : cell)).join(" | "));
        });
        console.log('\n');
    };

    const showResult = (winner) => {
        if (winner) {
            console.log(`${winner} wins!`);
        } else {
            console.log("It's a tie!");
        }
    };

    return { displayBoard, showResult };
})();

const gameController = (() => {
    let currentPlayer = 'X';
    let nextPlayer = 'O';
    let winner = null;

    const doRound = (position) => {
        if (!winner && gameBoard.placeMarker(currentPlayer, position)) {
            DOMdisplay.updateBoard();
            const board = gameBoard.getBoard();
            displayController.displayBoard(board);
            if (checkForWin()) {
                winner = currentPlayer;
                console.log(`${currentPlayer} wins`);
                DOMdisplay.displayWinner();
                // DOMdisplay.disableClick();
            } else if (checkTie()) {
                DOMdisplay.displayTie();
                console.log("It's a tie");
                return
            }
            DOMdisplay.playerTurnDisplay()
            switchPlayer();

        } else if(!winner && !gameBoard.placeMarker(currentPlayer,position)){
            console.log(winner)
            console.log(!gameBoard.placeMarker(currentPlayer,position))
            console.log("The spot is already taken");
            DOMdisplay.displaySpotTaken()
        }
    };

    const switchPlayer = () => {
        [currentPlayer,nextPlayer]=[nextPlayer,currentPlayer]    
    };

    const getNextPlayer=()=>{
        if(nextPlayer==='X')
            return (playerOne!=""?playerOne:'X');
        else return (playerTwo!=""?playerTwo:'O');
    };

    const getWinner = () => {
        return winner;
    };

    const checkForWin = () => {
        const board = gameBoard.getBoard();
        const checkLine = (a, b, c) => a === b && b === c && a !== "";
        for (let i = 0; i < 3; i++) {
            if (checkLine(board[i][0], board[i][1], board[i][2])) return true;
            if (checkLine(board[0][i], board[1][i], board[2][i])) return true;
        }
        if (checkLine(board[0][0], board[1][1], board[2][2])) return true;
        if (checkLine(board[2][0], board[1][1], board[0][2])) return true;
        return false;
    };

    const checkTie = () => {
        console.log(winner)
        return gameBoard.isFull() && !winner;
    };

    const resetGame = () => {
        currentPlayer = 'X';
        nextPlayer='O'
        winner = null;
    };

    return { doRound, getWinner, resetGame,getNextPlayer };
})();

const DOMdisplay = (() => {
    const displayWindow = document.querySelector('.display-window');
    const gamePad = document.querySelector('#game-pad');
    const newGameButton = document.querySelector('#start');
    let cells = gamePad.querySelectorAll('.cell');

    const disableClick = () => {
        cells.forEach(cell => {
            cell.replaceWith(cell.cloneNode(true));
        });
    };

    // const enableClick = () => {
    //     cells.forEach((cell, index) => {
    //         cell.addEventListener('click', () => {
    //             console.log("Cell clicked at position:", index);
    //             gameController.doRound(index);
    //         });
    //     });
    // }; OG

    const enableClick = () => {
        cells.forEach((cell, index) => {
            const newCell = cell.cloneNode(true); // Clone the cell to remove all event listeners
            gamePad.replaceChild(newCell, cell); // Replace the old cell with the cloned one
            
            newCell.addEventListener('click', () => {
                console.log("Cell clicked at position:", index);
                gameController.doRound(index);
            });
        });
        cells = document.querySelectorAll('.cell')
    };
    

    const updateBoard = () => {
        const board = gameBoard.getBoard();
        board.forEach((row, rowIndex) => {
            row.forEach((element, colIndex) => {
                const cellIndex = rowIndex * 3 + colIndex;
                cells[cellIndex].textContent = element;
            });
        });
    };

    const playerTurnDisplay =()=>{
        const winner = gameController.getWinner()
        if(!winner){
            displayWindow.textContent=`${gameController.getNextPlayer()}'s turn!`
        }
    }

    const resetDisplayBoard = () => {
        displayWindow.textContent = "";
    };

    const displayWinner = () => {
        const winner = gameController.getWinner();
        displayWindow.textContent = `${playerOne!=""?(winner==='X'?playerOne:playerTwo):winner} wins!`;
    };

    const displayTie = () => {
        displayWindow.textContent = "It's a tie!";
    };

    const displaySpotTaken=()=>{
        displayWindow.textContent="the spot is already taken"
    }

    const activateNewGame = () => {
        newGameButton.addEventListener('click', () => {
            gameBoard.resetBoard();
            gameController.resetGame();
            updateBoard();
            resetDisplayBoard();
            enableClick();
            getDisplayWIndow().textContent=`${playerOne!=""?playerOne:'X'}'s turn !`
        });
    };

    activateNewGame();  
   
    const getDisplayWIndow=()=>{
        return displayWindow
    }

    return { updateBoard, displayWinner, displayTie, enableClick, disableClick,playerTurnDisplay,activateNewGame ,resetDisplayBoard,getDisplayWIndow,displaySpotTaken};
})();

DOMdisplay.updateBoard();
 
const inputDialog = document.querySelector('#input-dialog')
const startButton = document.querySelector('#start-button')
const editPlayerButton=document.querySelector('#edit-name')

let playerOne, playerTwo;

inputDialog.showModal();

startButton.addEventListener('click', (event) => {
    event.preventDefault(); // Ensure it's at the start to prevent the form's default behavior
    playerOne = document.querySelector('#player-one').value;
    playerTwo = document.querySelector('#player-two').value;

    gameBoard.resetBoard();
    gameController.resetGame();
    DOMdisplay.updateBoard();
    DOMdisplay.resetDisplayBoard();
    DOMdisplay.enableClick();
    DOMdisplay.getDisplayWIndow().textContent=`${playerOne!=""?playerOne:'X'}'s turn !`

    
    inputDialog.close();   

    console.log(playerOne, playerTwo);   
});


editPlayerButton.addEventListener('click',()=>{
    inputDialog.showModal()
    // gameBoard.resetBoard();
    // gameController.resetGame();
    // DOMdisplay.updateBoard();
    // DOMdisplay.resetDisplayBoard();
    // DOMdisplay.enableClick();
})