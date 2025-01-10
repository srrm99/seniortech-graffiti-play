import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Props {
  onClose: () => void;
}

const WordSearch = ({ onClose }: Props) => {
  const { toast } = useToast();
  const [grid, setGrid] = useState<string[][]>([]);
  const [words] = useState(['PEACE', 'LOVE', 'HOPE', 'JOY', 'FAITH']);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selected, setSelected] = useState<number[][]>([]);

  const generateGrid = () => {
    const size = 8;
    const newGrid: string[][] = Array(size).fill('').map(() => 
      Array(size).fill('').map(() => 
        String.fromCharCode(65 + Math.floor(Math.random() * 26))
      )
    );

    // Place words in random positions
    words.forEach(word => {
      const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
      let placed = false;
      while (!placed) {
        const row = Math.floor(Math.random() * size);
        const col = Math.floor(Math.random() * size);
        
        if (direction === 'horizontal' && col + word.length <= size) {
          let canPlace = true;
          for (let i = 0; i < word.length; i++) {
            if (newGrid[row][col + i] !== word[i] && newGrid[row][col + i] !== '') {
              canPlace = false;
              break;
            }
          }
          if (canPlace) {
            for (let i = 0; i < word.length; i++) {
              newGrid[row][col + i] = word[i];
            }
            placed = true;
          }
        } else if (direction === 'vertical' && row + word.length <= size) {
          let canPlace = true;
          for (let i = 0; i < word.length; i++) {
            if (newGrid[row + i][col] !== word[i] && newGrid[row + i][col] !== '') {
              canPlace = false;
              break;
            }
          }
          if (canPlace) {
            for (let i = 0; i < word.length; i++) {
              newGrid[row + i][col] = word[i];
            }
            placed = true;
          }
        }
      }
    });

    setGrid(newGrid);
  };

  useEffect(() => {
    generateGrid();
  }, []);

  const handleCellClick = (row: number, col: number) => {
    const newSelected = [...selected, [row, col]];
    setSelected(newSelected);

    if (newSelected.length >= 3) {
      const selectedWord = getSelectedWord(newSelected);
      if (words.includes(selectedWord) && !foundWords.includes(selectedWord)) {
        setFoundWords([...foundWords, selectedWord]);
        toast({
          title: "Word Found!",
          description: `You found the word: ${selectedWord}`,
        });
      }
      setSelected([]);
    }
  };

  const getSelectedWord = (positions: number[][]) => {
    return positions.map(([row, col]) => grid[row][col]).join('');
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">Word Search</h2>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Find these words:</h3>
        <div className="flex flex-wrap gap-2">
          {words.map(word => (
            <span
              key={word}
              className={`px-2 py-1 rounded ${
                foundWords.includes(word)
                  ? 'bg-green-200 text-green-800'
                  : 'bg-gray-200'
              }`}
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-8 gap-1 mb-4">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Button
              key={`${rowIndex}-${colIndex}`}
              variant="outline"
              className={`w-10 h-10 p-0 text-lg font-bold ${
                selected.some(([r, c]) => r === rowIndex && c === colIndex)
                  ? 'bg-primary text-primary-foreground'
                  : ''
              }`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {cell}
            </Button>
          ))
        )}
      </div>

      <Button 
        onClick={() => generateGrid()}
        className="w-full mb-4"
      >
        New Game
      </Button>
    </Card>
  );
};

export default WordSearch;