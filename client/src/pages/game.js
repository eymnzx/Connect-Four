import socket from '../socket'

//player variables
export var pRed = "R";
export var pYellow = "Y";
export var currP = pRed;

//game variables
export var gameOver = false;
export var board;
export var currColumns;
export var rows = 6;
export var columns = 7;
export var round = 0;

export function setGame() {
    board = [];
    currColumns = [5, 5, 5, 5, 5, 5, 5];

    //creating id for tiles (row-column)
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            //js
            row.push(' ');

            //html
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            //creating tags for tile id in "board" id
            tile.classList.add("tile");
            tile.addEventListener("click", setPiece); //add user's tile
            document.getElementById("board").append(tile);
        }
        board.push(row);
    }
    if (document.getElementById("value").innerText === "Yellow") {
        turn(true);
    }
}

socket.on("update", (move) => {
    turn(false);

    let piece;
    if (move.player === pRed) {
        piece = "red-piece";
        currP = pYellow;
    }
    else {
        piece = "yellow-piece";
        currP = pRed;
    }
    
    let r = currColumns[move.col];

    const tile = document.getElementById(r.toString() + "-" + move.col.toString());
    if (tile) {
        tile.classList.add(piece); // Add the correct piece class to the tile
    }
    // document.getElementById("whosTurn").innerText = "Your Turn";

    //update tile placement height for column
    board[r][move.col] = move.player;
    currColumns[move.col] = r - 1;

    checkWinner();
});

export function turn(disable) {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        if (disable) {
            tile.classList.add('disabled')
        }
        else {
            tile.classList.remove('disabled');
        }
    });
}

export function setPiece() {
    if (gameOver) {
        return;
    }

    let coords = this.id.split("-"); //split id for row and column
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    
    socket.emit("moveMade", { socketID: socket.id, player: currP, col: c, turns: round });

    r = currColumns[c];
    if (r < 0) {
        return;
    }

    board[r][c] = currP;
    let tile = document.getElementById(r.toString() + "-" + c.toString());
    if (currP == pRed) {
        tile.classList.add("red-piece");
        currP = pYellow;
        // document.getElementById("whosTurn").innerText = "Yellow's Turn";
    }
    else {
        tile.classList.add("yellow-piece");
        currP = pRed;
        // document.getElementById("whosTurn").innerText = "Red's Turn";
    }

    //update tile placement height for column
    r -= 1; //cuz array
    currColumns[c] = r;
    checkWinner();
    turn(true);
}

export function checkWinner() {
    //check horizontally
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r][c + 1] && board[r][c + 1] == board[r][c + 2] && board[r][c + 2] == board[r][c + 3]) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }

    //check vertically
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 3; r++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r + 1][c] && board[r + 1][c] == board[r + 2][c] && board[r + 2][c] == board[r + 3][c]) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }

    //check anti diagonally
    for (let r = 0; r < rows - 3; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r + 1][c + 1] && board[r + 1][c + 1] == board[r + 2][c + 2] && board[r + 2][c + 2] == board[r + 3][c + 3]) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }

    //check diagonally
    for (let r = 3; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r - 1][c + 1] && board[r - 1][c + 1] == board[r - 2][c + 2] && board[r - 2][c + 2] == board[r - 3][c + 3]) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }
}

export function setWinner(r, c) {
    turn(true);
    let winner = document.getElementById("winner");
    if (board[r][c] == pRed) {
        winner.innerText = "Red Wins!";
    }
    else {
        winner.innerText = "Yellow Wins!";
    }

    gameOver = true;
}

export function changePlayer(player) {
    // if (currP === pRed){
    //     currP = pYellow
    // }else{
    //     currP = pRed
    // }
    let piece;

    if (player === pRed) {
        piece = "red-piece";
        // changePlayer(pYellow);
        currP = pYellow;
    }
    else {
        piece = "yellow-piece";
        // changePlayer(pRed);
        currP = pRed;
    }
    return piece;
}
