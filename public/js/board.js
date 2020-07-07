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
    boardToMatrix(xo);
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

const storeMatrix = (xo, matrix) => {
    const request = new XMLHttpRequest();
    request.open("POST", '/api/board', true);
    request.setRequestHeader('Content-Type', 'application/json');
    const json = {
        player: xo,
        matrix: matrix
    }
    request.send(JSON.stringify(json));
}

const retrieveMatrix = () => {
    const request = new XMLHttpRequest();
    request.open("GET", '/api/board', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onreadystatechange = function() { 
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            const data = JSON.parse(this.response)
            fillBoard(data.matrix);
            const currentPlayer = document.getElementById("current-player");
            currentPlayer.innerHTML = (data.player === 'x' ? 'o' : 'x');
        }
    }
    request.send();
}

const boardToMatrix = (xo) => {
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
    storeMatrix(xo, matrix);
    
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

    const matrix = boardToMatrix(xo);

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

    if (message !== '') return message;
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
    if (message !== '') return message;

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
    if (message !== '') return message;
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
    if (message !== '') return message;
    if (checkFilledBoard(matrix)) return "Game over - No winner";
    return '';
}

const clickEvent = (event) => {
    // Check if the game has ended already.
    if (end) return;
    // Check if the cell has a value already.
    if (event.target.innerText !== '') return;
    const currentPlayer = document.getElementById("current-player");
    let xo = currentPlayer.innerText;
    event.target.innerHTML = xo;
    const message = checkWinner(xo);
    if (message !== '') {
        const messagenode = document.getElementById("message");
        messagenode.innerHTML = message;
        alert(`Player ${(xo === "x" ? 2 : 1)} won!`);
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
}

initializeCode();
// Retrieve the status of the board from the database.
retrieveMatrix();
