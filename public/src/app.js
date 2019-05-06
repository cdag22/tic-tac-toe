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
      moveCount: 0
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
      } else {
        State.GameState.isXMove = true;
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
      UserInput.makeSquaresInteractive();
      State.incrementScore(winner);
      State.updateScoreBoard();
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
        UserInput.makeBoardUnclickable();
        alert(`Player ${currentPlayer === 'X' ? State.PlayerState.xName : State.PlayerState.oName} Wins!`);
        State.resetBoard(currentPlayer);
      } else if (State.isBoardFull()) {
        // setTimeout(() => , 200);
        UserInput.makeBoardUnclickable();
        alert(`Game is a Draw`);
        State.resetBoard();
      }
    }
  };





  let Presentation = {
    //---------------------------------------------------------------------------
    // GLOBALS
    squares: document.getElementsByClassName('square'),
    rows: document.getElementsByTagName('tr'),
    columns: [getColumn(1), getColumn(2), getColumn(3)],
    leftDiagonal: [getSquare(1, 1), getSquare(2, 2), getSquare(3, 3)],
    rightDiagonal: [getSquare(3, 1), getSquare(2, 2), getSquare(1, 3)],
    xScore: document.getElementById('x-wins'),
    oScore: document.getElementById('o-wins'),
    xNameplate: document.getElementById('x'),
    oNameplate: document.getElementById('o')
  };





  let UserInput = {
    //---------------------------------------------------------------------------
    // EVENT LISTENERS
    makeSquaresInteractive: function () {
      for (let i = 0; i < Presentation.squares.length; i++) {
        let sq = Presentation.squares[i];
        sq.addEventListener('click', UserInput.clickHandler, { once: true });
      }
    },
    makeBoardUnclickable: function () {
      for (let i = 0; i < Presentation.squares.length; i++) {
        let sq = Presentation.squares[i];
        sq.removeEventListener('click', UserInput.clickHandler, { once: true });
      }
    },
    clickHandler: function clickHandler(e) {
      e.preventDefault();
      let currentPlayer = State.getTextContent();
      UserInput.setColor(currentPlayer, this);
      this.textContent = currentPlayer;
      State.GameState.moveCount++;
      setTimeout(() => State.checkIfWinningMove(currentPlayer), 500);
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

  State.getPlayerNames();
  UserInput.makeSquaresInteractive();
};