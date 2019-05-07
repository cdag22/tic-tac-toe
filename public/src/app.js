window.onload = function () {


  //---------------------------------------------------------------------------
  // HELPER FUNCTIONS

  const getColumn = function (n) {
    return document.querySelectorAll(`.board-row .square:nth-child(${n}`);
  };

  const getSquare = function (row, col) {
    return document.querySelectorAll(`.board-row:nth-child(${row}) .square:nth-child(${col})`);
  };

  const convertToArray = function (arrayLike) {
    return Array.prototype.slice.call(arrayLike)
  };

  const getFullRows = function (rows) {
    return convertToArray(rows).map(item => convertToArray(item.children));
  };


  //---------------------------------------------------------------------------
  // GLOBALS

  let State = {
    PlayerState: {
      playerX: 'X',
      playerO: 'O',
      xName: '',
      oName: '',
    },
    GameState: {
      xWins: 0,
      oWins: 0,
      isXMove: false,
      moveCount: 0,
      shouldBoardRotate: false
    },
    // MOVE SWAPPING FUNCTIONALITY
    getTextContent: function () {
      State.GameState.isXMove = !State.GameState.isXMove;
      if (State.GameState.isXMove) {
        return State.PlayerState.playerX;
      } else {
        return State.PlayerState.playerO;
      }
    },
    // GAME STATE FUNCTIONALITY
    setWinnerGoesFirst: function (winner) {
      if (winner === 'X') {
        State.GameState.isXMove = false;
      } else if (winner === 'O') {
        State.GameState.isXMove = true;
      } else {
        State.GameState.isXMove = !State.GameState.isXMove;
      }
    },
    emptySquares: function () {
      State.GameState.moveCount = 0;
      for (let i = 0; i < Presentation.squares.length; i++) {
        let sq = Presentation.squares[i];
        if (sq.textContent === 'X') {
          sq.classList.remove('red-bg');
          sq.textContent = '';
        } else {
          sq.classList.remove('blue-bg');
          sq.textContent = '';
        }
      }
    },
    updateScoreBoard: function () {
      Presentation.xScore.textContent = State.GameState.xWins;
      Presentation.oScore.textContent = State.GameState.oWins;
    },
    incrementScore: function (winner) {
      if (winner === 'X') {
        State.GameState.xWins++;
      } else {
        State.GameState.oWins++;
      }
    },
    resetBoard: function (winner) {
      State.setWinnerGoesFirst(winner);
      State.emptySquares();
      UserInput.initialize();
      State.incrementScore(winner);
      State.updateScoreBoard();
      Presentation.gravityButton.classList.remove('unclickable');
    },
    getPlayerNames: function () {
      State.PlayerState.xName = prompt('Name of X:');
      State.PlayerState.oName = prompt('Name of O: ');
      Presentation.xNameplate.textContent = State.PlayerState.xName;
      Presentation.oNameplate.textContent = State.PlayerState.oName;
    },
    // WIN CALCULATION
    isVerticalWin: function () {
      let colValues = Presentation.columns.map(col => convertToArray(col).map(item => item.textContent));
      return colValues.some(col => col.every(value => value === col[0] && col[0] !== ''));
    },
    isHorizontalWin: function () {
      let rowsValues = convertToArray(Presentation.rows).map(row => convertToArray(row.children).map(item => item.textContent));
      return rowsValues.some(row => row.every(value => value === row[0] && row[0] !== ''));
    },
    isDiagonalWin: function () {
      let leftDiagonalValues = Presentation.leftDiagonal.map(sq => sq[0].textContent);
      let rightDiagonalValues = Presentation.rightDiagonal.map(sq => sq[0].textContent);
      let isLeftWin = leftDiagonalValues.every(value => value === leftDiagonalValues[0] && leftDiagonalValues[0] !== '');
      let isRightWin = rightDiagonalValues.every(value => value === rightDiagonalValues[0] && rightDiagonalValues[0] !== '');
      return isLeftWin || isRightWin;
    },
    isBoardFull: function () {
      return State.GameState.moveCount > 8;
    },
    checkIfWinningMove: function (currentPlayer) {
      if (State.isHorizontalWin() || State.isVerticalWin() || State.isDiagonalWin()) {
        UserInput.makeButtonsUnclickable();
        alert(`Player ${currentPlayer === 'X' ? State.PlayerState.xName : State.PlayerState.oName} Wins!`);
        State.resetBoard(currentPlayer);
      } else if (State.isBoardFull()) {
        UserInput.makeButtonsUnclickable();
        alert(`Game is a Draw`);
        State.resetBoard(null);
      }
    },
    // Board Rotation
    rotateBoard90deg: function () {
      let rows = Presentation.fullRows;

      // corner roation
      rows[0][0].before(rows[2][0]);
      rows = Presentation.updateFullRows();
      rows[0][3].before(rows[0][1]);
      rows = Presentation.updateFullRows();
      rows[2][1].before(rows[0][3]);
      rows = Presentation.updateFullRows();
      rows[2][0].before(rows[2][2]);
      rows = Presentation.updateFullRows();

      // inside rotation
      rows[1][2].before(rows[0][1]);
      rows = Presentation.updateFullRows();
      rows[2][1].before(rows[1][3]);
      rows = Presentation.updateFullRows();
      rows[1][0].before(rows[2][2]);
      rows = Presentation.updateFullRows();
      rows[0][1].before(rows[1][1]);
      Presentation.updateFullRows();
    }
  };





  let Presentation = {
    //---------------------------------------------------------------------------
    // GLOBALS
    squares: document.getElementsByClassName('square'),
    rows: document.getElementsByClassName('board-row'),
    fullRows: getFullRows(document.getElementsByClassName('board-row')),
    columns: [getColumn(1), getColumn(2), getColumn(3)],
    leftDiagonal: [getSquare(1, 1), getSquare(2, 2), getSquare(3, 3)],
    rightDiagonal: [getSquare(3, 1), getSquare(2, 2), getSquare(1, 3)],
    xScore: document.getElementById('x-wins'),
    oScore: document.getElementById('o-wins'),
    xNameplate: document.getElementById('x'),
    oNameplate: document.getElementById('o'),
    gravityButton: document.getElementById('gravity-btn'),
    updateFullRows: function () {
      Presentation.fullRows = getFullRows(document.getElementsByClassName('board-row'));
      return Presentation.fullRows;
    }
  };





  let UserInput = {
    //---------------------------------------------------------------------------
    // EVENT LISTENERS
    initialize: function () {
      UserInput.makeSquaresInteractive();
      UserInput.addGravity();
    },
    makeSquaresInteractive: function () {
      for (let i = 0; i < Presentation.squares.length; i++) {
        let sq = Presentation.squares[i];
        sq.addEventListener('click', UserInput.clickHandler, { once: true });
      }
    },
    makeButtonsUnclickable: function () {
      for (let i = 0; i < Presentation.squares.length; i++) {
        let sq = Presentation.squares[i];
        sq.removeEventListener('click', UserInput.clickHandler, { once: true });
      }
      Presentation.gravityButton.removeEventListener('click', UserInput.gravityClickHandler, { once: true });
    },
    clickHandler: function clickHandler(e) {
      e.preventDefault();
      let currentPlayer = State.getTextContent();
      UserInput.setColor(currentPlayer, this);
      this.textContent = currentPlayer;
      State.GameState.moveCount++;
      if (State.GameState.shouldBoardRotate) {
        State.rotateBoard90deg();
      }
      setTimeout(() => State.checkIfWinningMove(currentPlayer), 500);
    },
    gravityClickHandler: function gravityClickHandler(e) {
      e.preventDefault();
      State.GameState.shouldBoardRotate = true;
      this.classList.add('unclickable');
    },
    addGravity: function () {
      Presentation.gravityButton.addEventListener('click', UserInput.gravityClickHandler, { once: true });
    },
    //---------------------------------------------------------------------------
    // MOVE SWAPPING FUNCTIONALITY
    setColor: function (currentPlayer, square) {
      if (currentPlayer === 'X') {
        square.classList.add('red-bg');
      } else {
        square.classList.add('blue-bg');
      }
    }
  }




  //---------------------------------------------------------------------------
  // INITIALIZE

  // State.getPlayerNames();
  UserInput.initialize();
};