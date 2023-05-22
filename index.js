const boardSize = 10;
const cellSize = 50;
const mineCount = 10;
const boardWidth = boardSize * cellSize;
const boardHeight = boardSize * cellSize;
let gameBoard = [];
let mines = [];
let clicks = 0;
let gameStarted = false;
let gameOver = false;
let startTime;
let timerInterval;

function createGameBoard() {
  const gameContainer = document.createElement('div');
  gameContainer.id = 'game-container';
  gameContainer.style.display = 'grid';
  gameContainer.style.gridTemplateColumns = `repeat(${boardSize}, ${cellSize}px)`;
  gameContainer.style.gridTemplateRows = `repeat(${boardSize}, ${cellSize}px)`;
  gameContainer.style.width = `${boardWidth}px`;
  gameContainer.style.height = `${boardHeight}px`;
  gameContainer.style.position = 'absolute';
  gameContainer.style.left = '50%';
  gameContainer.style.top = '20%';
  gameContainer.style.transform = 'translate(-50%, -50%)';
  gameContainer.style.marginTop = '200px';

  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.style.border = '1px solid #000';
      cell.style.backgroundColor = '#ccc';
      cell.style.width = `${cellSize}px`;
      cell.style.height = `${cellSize}px`;
      cell.addEventListener('mousedown', handleCellClick);
      gameContainer.appendChild(cell);

      gameBoard.push({
        element: cell,
        opened: false,
        hasMine: false,
        flagged: false,
        value: 0,
      });
    }
  }

  document.body.appendChild(gameContainer);
}

function placeMines(firstClickedCell) {
  const excludedCells = [firstClickedCell];

  for (let i = 0; i < mineCount; i++) {
    let randomCell;

    do {
      randomCell = Math.floor(Math.random() * boardSize * boardSize);
    } while (excludedCells.includes(randomCell));

    gameBoard[randomCell].hasMine = true;
    mines.push(gameBoard[randomCell]);
  }
}

function handleCellClick(event) {
  const clickedCell = event.target;
  const row = parseInt(clickedCell.dataset.row);
  const col = parseInt(clickedCell.dataset.col);

  if (!gameStarted) {
    gameStarted = true;
    placeMines(row * boardSize + col);
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
  }

  openCell(row, col);
}


function openCell(row, col) {
  const cell = gameBoard[row * boardSize + col];

  if (cell.flagged) {
    return;
  }

  cell.opened = true;
  cell.element.style.backgroundColor = '#fff';

  if (cell.hasMine) {
    revealMines();
    gameOver = true;
    clearInterval(timerInterval);
    alert('Game Over! You clicked on a mine.');
  } else {
    const count = countAdjacentMines(row, col);
    cell.value = count;

    if (count > 0) {
      cell.element.textContent = count;
    } else {
      openAdjacentCells(row, col);
    }

    checkWin();
  }
}

function toggleFlag(row, col) {
  const cell = gameBoard[row * boardSize + col];

  if (!cell.opened) {
    cell.flagged = !cell.flagged;

    if (cell.flagged) {
      cell.element.textContent = '🚩';
    } else {
      cell.element.textContent = '';
    }
  }
}

function countAdjacentMines(row, col) {
  let count = 0;

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newRow = row + i;
      const newCol = col + j;

      if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
        if (gameBoard[newRow * boardSize + newCol].hasMine) {
          count++;
        }
      }
    }
  }

  return count;
}

function openAdjacentCells(row, col) {
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newRow = row + i;
      const newCol = col + j;

      if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
        const cell = gameBoard[newRow * boardSize + newCol];

        if (!cell.opened && !cell.hasMine) {
          openCell(newRow, newCol);
        }
      }
    }
  }
}

function revealMines() {
  for (const cell of mines) {
    if (!cell.flagged) {
      cell.element.style.backgroundColor = '#f00';
      cell.element.textContent = '💣';
    }
  }
}

function checkWin() {
  let remainingCells = 0;

  for (const cell of gameBoard) {
    if (!cell.opened && !cell.hasMine) {
      remainingCells++;
    }
  }

  if (remainingCells === 0) {
    gameOver = true;
    clearInterval(timerInterval);
    alert(`Congratulations! You won in ${clicks} clicks.`);
  }
}

createGameBoard();