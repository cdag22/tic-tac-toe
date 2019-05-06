window.onload = function () {


  //---------------------------------------------------------------------------
  // HELPER FUNCTIONS

  const getColumn = function (n) {
    return document.querySelectorAll(`tr td:nth-child(${n}`);
  };

  const getSquare = function (row, col) {
    return document.querySelectorAll(`tr:nth-child(${row}) td:nth-child(${col})`);
  };

  const convertToArray = function (arrayLike) {
    return Array.prototype.slice.call(arrayLike)
  }



  //---------------------------------------------------------------------------
  // WIN CALCULATION

  const isVerticalWin = function () {
    let colValues = columns.map(col => convertToArray(col).map(item => item.textContent));
    return colValues.some(col => col.every(value => value === col[0] && col[0] !== ''));
    console.log('columns', columns)
    console.log(colValues);
  };

  const isHorizontalWin = function () {
    let rowsValues = convertToArray(rows).map(row => convertToArray(row.children).map(item => item.textContent));
    return rowsValues.some(row => row.every(value => value === row[0] && row[0] !== ''));
  };

  const isDiagonalWin = function () {
    let leftDiagonalValues = leftDiagonal.map(sq => sq[0].textContent);
    let rightDiagonalValues = rightDiagonal.map(sq => sq[0].textContent);
    let isLeftWin = leftDiagonalValues.every(value => value === leftDiagonalValues[0] && leftDiagonalValues[0] !== '');
    let isRightWin = rightDiagonalValues.every(value => value === rightDiagonalValues[0] && rightDiagonalValues[0] !== '');
    return isLeftWin || isRightWin;
  };

  const isBoardFull = function () {
    return moveCount > 8;
  };

  const checkIfWinningMove = function (currentPlayer) {
    if (isHorizontalWin() || isVerticalWin() || isDiagonalWin()) {
      makeBoardUnclickable();
      alert(`Player ${currentPlayer} Wins!`);
    } else if (isBoardFull()) {
      // setTimeout(() => , 200);
      alert(`Game is a Draw`)
    }
  };



  //---------------------------------------------------------------------------
  // MOVE SWAPPING FUNCTIONALITY

  const getTextContent = function () {
    isXMove = !isXMove;
    if (isXMove) {
      return playerX;
    } else {
      return playerO;
    }
  };

  const setColor = function (currentPlayer, square) {
    if (currentPlayer === 'X') {
      square.classList.add('red-bg');
    } else {
      square.classList.add('blue-bg');
    }
  };



  //---------------------------------------------------------------------------
  // EVENT LISTENERS

  const makeSquaresInteractive = function () {
    for (let i = 0; i < squares.length; i++) {
      let sq = squares[i];
      sq.addEventListener('click', clickHandler, { once: true });
    }
  };

  const makeBoardUnclickable = function () {
    for (let i = 0; i < squares.length; i++) {
      let sq = squares[i];
      sq.removeEventListener('click', clickHandler, { once: true });
    }
  };

  const clickHandler = function clickHandler(e) {
    e.preventDefault();
    let currentPlayer = getTextContent();
    setColor(currentPlayer, this);
    this.textContent = currentPlayer;
    moveCount++;
    console.log('movecount', moveCount);
    setTimeout(() => checkIfWinningMove(currentPlayer), 500);
  };



  //---------------------------------------------------------------------------
  // GLOBALS

  // Players
  const playerX = 'X';
  const playerO = 'O';

  let isXMove = false;
  let moveCount = 0;

  // Elements and Elememnt Lists
  const squares = document.getElementsByClassName('square');
  const rows = document.getElementsByTagName('tr');
  const columns = [getColumn(1), getColumn(2), getColumn(3)];
  const leftDiagonal = [getSquare(1, 1), getSquare(2, 2), getSquare(3, 3)];
  const rightDiagonal = [getSquare(3, 1), getSquare(2, 2), getSquare(1, 3)];



  //---------------------------------------------------------------------------
  // INITIALIZE

  makeSquaresInteractive();
};