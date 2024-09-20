const gameBoard = (()=>{
    const row = 3;
    const col = 3;
    const board = Array.from({length:3},()=>["","",""]);


    const resetBoard = ()=>{
        for(let i=0;i<row;i++){
            for(let j=0;j<col;j++){
                board[i][j]="";
            }
        }
    }

    const getBoard = ()=>board;
    const positionToRowCol=(position)=>{
        const row = Math.floor(position/3);
        const col = Math.floor(position%3);
        return {row,col};
    }

    const placeMarker=(marker,position)=>{
        position = positionToRowCol(position);
        let {row,col}=position;
        if(board[row][col]===""){
            board[row][col]=marker;
            return true;
        } else {
            return false;
        }
    }

    const isFull=()=>{
        for(let i=0;i<row;i++){
            for(let j=0;j<col;j++){
                if(board[i][j]==""){
                    return false;
                }
            }
        }
        return true;
        
    };

    return {getBoard,isFull,placeMarker,resetBoard} 
}
)();

const displayController=(()=>{
    const displayBoard =(board)=>{
        console.clear();
        board.forEach(row=>{
            console.log(row.map(cell=>(cell===""?"_":cell)).join(" | "));
        })
        console.log('\n');
    }

    const showResult=(winner)=>{
        if(winner){
            console.log(`${winner} wins!`);
        }
        else 
            console.log("It's a tie!");
    }

    return{displayBoard,showResult};
})();


const gameController= (()=>{
    let currentPlayer='X';
    let winner=null;

    const startGame = ()=>{
        gameBoard.resetBoard();
        currentPlayer="X";
        winner = null;

        while(!winner&&!checkTie()){
            displayController.displayBoard(gameBoard.getBoard());

            let position = null;
            do {
                position = prompt(`${currentPlayer}'s turn. Enter the position: (0-8)`);
                if(isNaN(position) || position===""|| position < 0 || position > 8)
                    alert("Enter valid position");
                if(position === null){
                    console.log("Game exited.");
                    return;
                }

                position = parseInt(position);
            } while (isNaN(position) || position < 0 || position > 8);



            if(gameBoard.placeMarker(currentPlayer,position)){
                winner= checkForWin();
                if(!winner) switchPlayer();
            } else {
                console.log("spot is already taken! try again");
            }
            
        }
        displayController.displayBoard(gameBoard.getBoard());
        displayController.showResult(winner);

    }

    const switchPlayer=()=>{
        currentPlayer=currentPlayer==="X"?"O":"X"
    }

    const checkForWin=()=>{
        const board = gameBoard.getBoard();
        const checkLine  = (a,b,c)=> a===b && b===c && a!="";
        for(let i = 0 ;i<3;i++){
            if(checkLine(board[i][0],board[i][1],board[i][2])) return board[i][0];
            if(checkLine(board[0][i],board[1][i],board[2][i])) return board[0][i];
        }

        if(checkLine(board[0][0],board[1][1],board[2][2])) return board[0][0]
        if(checkLine(board[2][0],board[1][1],board[0][2])) return board[2][0]   

        return null;
    }

    const checkTie  = ()=>{
        return gameBoard.isFull() && !winner;

    }

    return { startGame };
})();


gameController.startGame();

