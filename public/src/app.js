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

<<<<<<< HEAD
  const buildColumnFromSquare = function (square) {
    let sqId = Number(square.id) < 4 ? 1 : (Number(square.id) < 7 ? 4 : 7);

    let columns = [document.getElementById(String(sqId)), document.getElementById(String(sqId + 1)), document.getElementById(String(sqId + 2))];
    return columns;
  };
=======

>>>>>>> master


  //---------------------------------------------------------------------------
  // STATE

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
      shouldBoardRotate: false,
      shouldHaveGravity: false,
    },
    // initialize and board reset
    initialize: function () {
      // State.getPlayerNames();
      UserInput.initialize();
      Presentation.initialize();
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
      } else if (winner == 'O') {
        State.GameState.oWins++;
      }
    },
    resetBoard: function (winner) {
      State.setWinnerGoesFirst(winner);
      State.emptySquares();
      UserInput.initialize();
      Presentation.initialize();
      State.incrementScore(winner);
      State.updateScoreBoard();
      State.GameState.shouldHaveGravity = false;
      State.GameState.shouldBoardRotate = false;
    },
    master
    getPlayerNames: function () {
      State.PlayerState.xName = prompt('Name of X:');
      State.PlayerState.oName = prompt('Name of O: ');
      Presentation.xNameplate.textContent = State.PlayerState.xName;
      Presentation.oNameplate.textContent = State.PlayerState.oName;
    },
    // WIN CALCULATION
    isVerticalWin: function () {
      let colValues = Presentation.columnChildren.map(col => convertToArray(col).map(item => item.textContent));
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
      let rows = Presentation.rowChildren;

      // corner roation
      rows[0][0].before(rows[2][0]);
      rows = Presentation.updateRowChildren();
      rows[0][3].before(rows[0][1]);
      rows = Presentation.updateRowChildren();
      rows[2][1].before(rows[0][3]);
      rows = Presentation.updateRowChildren();
      rows[2][0].before(rows[2][2]);
      rows = Presentation.updateRowChildren();

      // inside rotation
      rows[1][2].before(rows[0][1]);
      rows = Presentation.updateRowChildren();
      rows[2][1].before(rows[1][3]);
      rows = Presentation.updateRowChildren();
      rows[1][0].before(rows[2][2]);
      rows = Presentation.updateRowChildren();
      rows[0][1].before(rows[1][1]);
      Presentation.updateRowChildren();
      Presentation.updateColumnChildren();
    },
    isSquareOccupied: function (rowIndex, colIndex) {
      let sq = Presentation.rowChildren[rowIndex][colIndex];
      return sq.classList.contains('red-bg') || sq.classList.contains('blue-bg');
    },
    giveBoardGravity: function (square) {
      let column = buildColumnFromSquare(square);
      let rows = Presentation.updateRowChildren();
      let id = Number(square.id);
      let rowIndex = (id % 3 === 0) ? 2 : (id % 3) - 1;
      let colIndex = id < 4 ? 0 : (id < 7 ? 1 : 2);
      // rowIndex++;
      // while (!State.isSquareOccupied(rowIndex, colIndex) && rowIndex < 2) {
      //   rows[rowIndex][colIndex].before(rows[rowIndex - 1][colIndex])
      //   rows = Presentation.updateRowChildren();
      //   rows[rowIndex - 1][colIndex].before(rows[rowIndex][colIndex + 1]);
      //   rows = Presentation.updateRowChildren();
      //   rowIndex++;
      // }
      console.log('row/col', rowIndex, '/', colIndex);
      console.log('rows', rows);
      Presentation.updateFullRows();
      let cols = Presentation.updateColumns();
      console.log('cols', cols);
      for (let i = 0; i < cols.length; i++) {
        let target = null;
        for (let k = 0; k < cols[i].length; k++) {
          let item = cols[i][k];
          if (item.classList.contains('red-bg') || item.classList.contains('blue-bg')) {
            target = item;
            let targetI = i;
            let targetK = k;
            k++
            while (k < cols.length) {
              item = cols[i][k];
              if (!item.classList.contains('red-bg') && !item.classList.contains('blue-bg')) {
                if (i > 0) {
                  item.before(target);
                  cols[i - 1][targetK].after(item);
                  // } else {
                  //   item.after(target);
                  //   console.log(Presentation.updateColumns());
                  //   debugger;
                  //   cols[0][targetK].before(cols[0][targetK]);
                  //   break;
                  //   // cols[i][targetK].before(item);
                }
                targetK++;
                k++;
              } else {
                break;
              }
            }
            break;
          }
        }
      }
      cols = Presentation.updateColumns();
      console.log('cols', cols); ster
    }
  };



  //---------------------------------------------------------------------------
  // PRESENTATION

  let Presentation = {
    // GLOBALS
    squares: document.getElementsByClassName('square'),
    rows: document.getElementsByClassName('board-row'),

    rowChildren: null,
    columnChildren: null,

    leftDiagonal: [getSquare(1, 1), getSquare(2, 2), getSquare(3, 3)],
    rightDiagonal: [getSquare(3, 1), getSquare(2, 2), getSquare(1, 3)],
    xScore: document.getElementById('x-wins'),
    oScore: document.getElementById('o-wins'),
    xNameplate: document.getElementById('x'),
    oNameplate: document.getElementById('o'),
    gravityButton: document.getElementById('gravity-btn'),
    rotationButton: document.getElementById('rotation-btn'),
    updateRowChildren: function () {
      let rows = Presentation.rows;
      Presentation.rowChildren = convertToArray(rows).map(item => convertToArray(item.children));
      return Presentation.rowChildren;
    },
    updateColumnChildren: function () {
      let columns = [convertToArray(getColumn(1)), convertToArray(getColumn(2)), convertToArray(getColumn(3))];
      Presentation.columnChildren = columns;
      return columns;
    },
    initialize: function () {
      Presentation.updateRowChildren();
      Presentation.updateColumnChildren();
      Presentation.gravityButton.classList.remove('unclickable');
      Presentation.rotationButton.classList.remove('unclickable');
      Presentation.gravityButton.disabled = false;
      Presentation.rotationButton.disabled = false;

    }
  };





  //---------------------------------------------------------------------------
  // USER INPUT

  let UserInput = {
    // EVENT LISTENERS
    initialize: function () {
      UserInput.makeSquaresInteractive();
      UserInput.addGravity();
      UserInput.addRotation();
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
    },
    clickHandler: function clickHandler(e) {
      e.preventDefault();
      let currentPlayer = State.getTextContent();
      UserInput.setColor(currentPlayer, this);
      this.textContent = currentPlayer;
      State.GameState.moveCount++;
      if (State.GameState.moveCount > 0 && State.GameState.moveCount < 2) {
        Presentation.gravityButton.removeEventListener('click', UserInput.gravityClickHandler, { once: true });
        Presentation.rotationButton.removeEventListener('click', UserInput.rotationClickHandler, { once: true });
        Presentation.gravityButton.classList.add('unclickable');
        Presentation.rotationButton.classList.add('unclickable');
        Presentation.gravityButton.disabled = true;
        Presentation.rotationButton.disabled = true;

      }
      if (State.GameState.shouldBoardRotate) {
        State.rotateBoard90deg();
      }
      if (State.GameState.shouldHaveGravity) {
        State.giveBoardGravity(this);
      }
      setTimeout(() => State.checkIfWinningMove(currentPlayer), 500);
    },
    gravityClickHandler: function gravityClickHandler(e) {
      e.preventDefault();
      State.GameState.shouldHaveGravity = true;
      this.classList.add('unclickable');
    },
    rotationClickHandler: function gravityClickHandler(e) {
      e.preventDefault();
      State.GameState.shouldBoardRotate = true;
      this.classList.add('unclickable');
    },
    addRotation: function () {
      Presentation.rotationButton.addEventListener('click', UserInput.rotationClickHandler, { once: true });
    },
    addGravity: function () {
      Presentation.gravityButton.addEventListener('click', UserInput.gravityClickHandler, { once: true });
    },
    addRotation: function () {
      Presentation.rotationButton.addEventListener('click', UserInput.rotationClickHandler, { once: true });
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
<<<<<<< HEAD

=======
>>>>>>> master
  State.initialize();
};