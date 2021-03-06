const columns = 5;
const rows = 5;
let end = false;

const buildRow = (x, y) => {
    let row = '<tr>';
    for (let i = 1; i <= x; i++) {
        row += `<td data-x="${i}" data-y="${y}" class="cell"></td>`;
    }
    row += '</tr>';
    return row;
}

const buildTable = (x, y) => {
    let table = '<table id="table">';
    for (let i = y; i >= 1; i--) {
        table += buildRow(x, i);
    }
    table += '</table>';
    return table;
}

const resetBoard = (xo) => {
    const board = document.getElementById("board");
    board.innerHTML = buildTable(columns, rows);
    const table = document.getElementById("table");
    table.addEventListener("mousedown", clickEvent);
    const messagenode = document.getElementById("message");
    messagenode.innerHTML = '';
    end = false;
    boardToMatrix(xo, 'new');
}

const fillBoard = (matrix) => {
    const board = document.getElementById("board");
    board.innerHTML = buildTable(columns, rows);
    const table = document.getElementById("table");
    table.addEventListener("mousedown", clickEvent);
    
    // Cycle thru all the td's and restore the values from the matrix.
    const cells = document.getElementsByTagName('td');
    let x, y;
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].hasAttribute('data-x') && cells[i].className === 'cell') {
            x = parseInt(cells[i].dataset.x);
            y = parseInt(cells[i].dataset.y);
            if (matrix[x] && matrix[x][y]) {
                cells[i].innerText = matrix[x][y];
            }
        }
    }
}

const storeMatrix = (xo, matrix, status) => {
    const request = new XMLHttpRequest();
    request.open("POST", '/api/board', true);
    request.setRequestHeader('Content-Type', 'application/json');
    const json = {
        player: xo,
        matrix: matrix,
        status: status,
    }
    request.send(JSON.stringify(json));
}

const retrieveMatrix = () => {
    if (end === false) {
        const request = new XMLHttpRequest();
        request.open("GET", '/api/board', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.onreadystatechange = function() { 
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                const data = JSON.parse(this.response)
                fillBoard(data.matrix);
                if (data.status === 'over') {
                    end = true;
                    console.log(data.player);
                    alert(`Player ${(data.player === "x" ? 1 : 2)} won!`);
                }
                if (data.status === 'ongoing') {
                    const currentPlayer = document.getElementById("current-player");
                    currentPlayer.innerHTML = (data.player === 'x' ? 'o' : 'x');
                }
                // Store the player.
                if (localStorage.getItem('player') === '') {
                    setPlayer();
                }
            }
        }
        request.send();
    }
}

const setPlayer = () => {
    const request = new XMLHttpRequest();
    request.open("GET", '/api/player', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onreadystatechange = function() { 
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            const data = JSON.parse(this.response);
            document.getElementById('session-player').innerText = data.player;
            if (data.player === '') {
                alert('Two players are playing already. Please try again later.');
                end = true;
            }
            else {
                localStorage.setItem('player', (data.player));
                console.log('player was set to ' + data.player);
            }
        }
    }
    request.send();
}

const boardToMatrix = (xo, status) => {
    // Create a matrix where to store the values.
    let matrix = [];
    for (let i = 1; i <= rows; i++) {
        matrix[i] = [];
        for (let j = 1; j <= columns; j++) {
            matrix[i][j] = '';
        }
    }
    
    // Cycle thru all the td's and store the values in the matrix.
    const cells = document.getElementsByTagName('td');
    let x, y, value;
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].hasAttribute('data-x')) {
            x = cells[i].dataset.x;
            y = cells[i].dataset.y;
            value = cells[i].innerText;
            matrix[x][y] = value;
        }
    }
    
    // Store the status of the board in the database.
    storeMatrix(xo, matrix, status);
    
    return matrix;
}

const checkFilledBoard = (matrix) => {
    let filled = true;
    for (let i = 1; i <= rows; i++) {
        for (let j = 1; j <= columns; j++) {
            if (matrix[i][j] === '') {
                filled = false;
                continue;
            }
        }
    }
    return filled;
}

const checkWinner = (xo) => {
    let message = '';

    const matrix = boardToMatrix(xo, 'ongoing');

    // Check the rows.
    for (let j = 1; j <= columns; j++) {
        let accumulator = matrix[1][j];
        if (accumulator !== '') {
            for (let i = 1; i <= rows; i++) {
                // If there is a break in the sequence, skip to next cycle
                if (accumulator !== matrix[i][j]) {
                    message = '';
                    break; 
                }
                else {
                    message = "The winner is " + accumulator;
                }
            }
        }
        if (message !== '') break;
    }
    if (message !== '') {
        boardToMatrix(xo, 'over');
        return message;
    }

    // Check the columns.
    for (let i = 1; i <= rows; i++) {
        let accumulator = matrix[i][1];
        if (accumulator !== '') {
            for (let j = 1; j <= columns; j++) {
                // If there is a break in the sequence, skip to next cycle
                if (accumulator !== matrix[i][j]) {
                    message = '';
                    break; 
                }
                else {
                    message = "The winner is " + accumulator;
                }
            }
        }
        if (message !== '') break;
    }
    if (message !== '') {
        boardToMatrix(xo, 'over');
        return message;
    }

    // Check the diagonals.
    for (let i = 1; i <= rows; i++) {
        let accumulator = matrix[1][1];
        if (accumulator !== '') {
            // If there is a break in the sequence, skip to next cycle
            if (accumulator !== matrix[i][i]) {
                message = '';
                break; 
            }
            else {
                message = "The winner is " + accumulator;
            }
        }
    }
    if (message !== '') {
        boardToMatrix(xo, 'over');
        return message;
    }

    for (let i = 1; i <= rows; i++) {
        let accumulator = matrix[rows][1];
        if (accumulator !== '') {
            // If there is a break in the sequence, skip to next cycle
            if (accumulator !== matrix[rows-i+1][i]) {
                message = '';
                break; 
            }
            else {
                message = "The winner is " + accumulator;
            }
        }
    }
    if (message !== '') {
        boardToMatrix(xo, 'over');
        return message;
    }
    if (checkFilledBoard(matrix)) {
        boardToMatrix(xo, 'over');
        end = true;
        return "Game over - No winner";
    }
    return '';
}

const clickEvent = (event) => {
    const messagenode = document.getElementById("message");
    // Check if the game has ended already.
    if (end) return;
    // Check if the cell has a value already.
    if (event.target.innerText !== '') return;
    // Check if the current player corresponds to the cookie.
    const currentPlayer = document.getElementById("current-player");
    let xo = currentPlayer.innerText;
    if (xo !== localStorage.getItem('player')) return;
    // Proceed.
    event.target.innerHTML = xo;
    const message = checkWinner(xo);
    if (message !== '') {
        messagenode.innerHTML = message;
        if (end === false) alert(`Player ${(xo === "x" ? 1 : 2)} won!`);
        end = true;
    }
    else {
        xo = (xo === "x") ? "o" : "x";
        currentPlayer.innerText = xo;    
    };
}

const initializeCode = () => {
    console.log("Initializing");
    const button = document.getElementById("reset");
    button.addEventListener("click", event => {
        const currentPlayer = document.getElementById("current-player");
        currentPlayer.innerText = 'x';
        resetBoard('x');
        event.stopPropagation();
    });
    // At the first load, reset the player cookie. It will be set with the first retrieveMatrix.
    if (localStorage.hasOwnProperty('player')){
        document.getElementById('session-player').innerText = localStorage.getItem('player');
    }
    else {
        localStorage.setItem('player', '');
    }
    setInterval(retrieveMatrix, 1000);
}

initializeCode();
// Retrieve the status of the board from the database.
retrieveMatrix();
