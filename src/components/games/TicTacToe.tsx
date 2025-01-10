import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Props {
  onClose: () => void;
}

const TicTacToe = ({ onClose }: Props) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const calculateWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (i: number) => {
    if (calculateWinner(board) || board[i]) return;
    
    const newBoard = board.slice();
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const winner = calculateWinner(board);
  const status = winner 
    ? `Winner: ${winner}`
    : board.every(square => square) 
    ? "Game Draw!"
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">Tic Tac Toe</h2>
      <div className="text-xl text-center mb-4">{status}</div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {board.map((square, i) => (
          <Button
            key={i}
            className="h-20 text-2xl font-bold bg-primary hover:bg-primary/90"
            onClick={() => handleClick(i)}
          >
            {square}
          </Button>
        ))}
      </div>
      <div className="flex justify-center gap-4">
        <Button onClick={resetGame} className="bg-accent hover:bg-accent/90">
          New Game
        </Button>
      </div>
    </Card>
  );
};

export default TicTacToe;