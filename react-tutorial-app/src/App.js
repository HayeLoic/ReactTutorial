import React from 'react';
import './App.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    var clickedSquareIds = [];
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
      clickedSquareIds: clickedSquareIds
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    let clickedSquareIds = this.state.clickedSquareIds.slice();
    clickedSquareIds[this.state.stepNumber + 1] = i;

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      clickedSquareIds: clickedSquareIds
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  getCoordinates(squareId) {
    if (squareId == null) {
      return null;
    }

    let coordinateRow;
    let coordinateColumn;

    if (squareId === 0) {
      coordinateRow = 1;
      coordinateColumn = 1;
    }
    if (squareId === 1) {
      coordinateRow = 1;
      coordinateColumn = 2;
    }
    if (squareId === 2) {
      coordinateRow = 1;
      coordinateColumn = 3;
    }
    if (squareId === 3) {
      coordinateRow = 2;
      coordinateColumn = 1;
    }
    if (squareId === 4) {
      coordinateRow = 2;
      coordinateColumn = 2;
    }
    if (squareId === 5) {
      coordinateRow = 2;
      coordinateColumn = 3;
    }
    if (squareId === 6) {
      coordinateRow = 3;
      coordinateColumn = 1;
    }
    if (squareId === 7) {
      coordinateRow = 3;
      coordinateColumn = 2;
    }
    if (squareId === 8) {
      coordinateRow = 3;
      coordinateColumn = 3;
    }

    return 'coordinates : row ' + coordinateRow + ' ; column ' + coordinateColumn;
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const squareId = this.state.clickedSquareIds[move];
      const description = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{description}</button>
          <span className={(move === this.state.stepNumber ? 'selected-move' : '')}>{this.getCoordinates(squareId)}</span>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

export default Game;

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}