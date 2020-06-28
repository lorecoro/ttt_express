const columns = 5;
const rows = 5;
let end = false;

const buildrow = (x, y) => {
    let row = '<tr>';
    for (let i = 1; i <= x; i++) {
        row += `<td data-x="${i}" data-y="${y}" class="cell"></td>`;
    }
    row += '</tr>';
    return row;
}

const buildtable = (x, y) => {
    let table = '<table id="table">';
    for (let i = y; i >= 1; i--) {
        table += buildrow(x, i);
    }
    table += '</table>';
    return table;
}

const resetBoard = () => {
    const board = document.getElementById("board");
    board.innerHTML = buildtable(columns, rows);
    const table = document.getElementById("table");
    table.addEventListener("mousedown", clickEvent);
    const messagenode = document.getElementById("message");
    messagenode.innerHTML = '';
    end = false;
}

const checkWinner = () => {
    let message = '';
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
    let filled = 0;
    let x, y, value;
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].hasAttribute('data-x')) {
            x = cells[i].dataset.x;
            y = cells[i].dataset.y;
            value = cells[i].innerText;
            matrix[x][y] = value;
            if (value !== '') filled++;
        }
    }

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
    if (filled === rows*columns) return "Game over - No winner";
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
    xo = (xo === "x") ? "o" : "x";
    currentPlayer.innerText = xo;
    const message = checkWinner();
    if (message !== '') {
        const messagenode = document.getElementById("message");
        messagenode.innerHTML = message;
        alert(`Player ${(xo === "x" ? 2 : 1)} won!`);
        end = true;
    };
}

const initializeCode = () => {
    console.log("Initializing");
    const button = document.getElementById("reset");
    button.addEventListener("click", event => {
      resetBoard();
      event.stopPropagation();
    });
}

initializeCode();
resetBoard();

