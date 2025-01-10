import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Props {
  onClose: () => void;
}

const Snake = ({ onClose }: Props) => {
  const [snake, setSnake] = useState<number[][]>([[0, 0]]);
  const [food, setFood] = useState<number[]>([5, 5]);
  const [direction, setDirection] = useState<string>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed] = useState(300); // Slower speed for seniors

  const createFood = useCallback(() => {
    return [
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10)
    ];
  }, []);

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    const newSnake = [...snake];
    let head = [...newSnake[0]];

    switch(direction) {
      case 'UP':
        head[1] -= 1;
        break;
      case 'DOWN':
        head[1] += 1;
        break;
      case 'LEFT':
        head[0] -= 1;
        break;
      case 'RIGHT':
        head[0] += 1;
        break;
    }

    // Check if snake hits the walls
    if (head[0] < 0 || head[0] > 9 || head[1] < 0 || head[1] > 9) {
      setGameOver(true);
      return;
    }

    // Check if snake hits itself
    if (newSnake.some(segment => segment[0] === head[0] && segment[1] === head[1])) {
      setGameOver(true);
      return;
    }

    newSnake.unshift(head);

    // Check if snake eats food
    if (head[0] === food[0] && head[1] === food[1]) {
      setScore(score + 1);
      setFood(createFood());
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, gameOver, score, createFood]);

  useEffect(() => {
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [moveSnake, speed]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch(e.key) {
        case 'ArrowUp':
          setDirection('UP');
          break;
        case 'ArrowDown':
          setDirection('DOWN');
          break;
        case 'ArrowLeft':
          setDirection('LEFT');
          break;
        case 'ArrowRight':
          setDirection('RIGHT');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  const resetGame = () => {
    setSnake([[0, 0]]);
    setFood(createFood());
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">Snake Game</h2>
      <div className="text-xl text-center mb-4">Score: {score}</div>
      
      <div className="grid grid-cols-10 gap-1 mb-4">
        {Array(100).fill(null).map((_, i) => {
          const x = Math.floor(i / 10);
          const y = i % 10;
          const isSnake = snake.some(segment => segment[0] === x && segment[1] === y);
          const isFood = food[0] === x && food[1] === y;
          
          return (
            <div
              key={i}
              className={`w-8 h-8 border ${
                isSnake ? 'bg-accent' : 
                isFood ? 'bg-primary' : 'bg-white'
              }`}
            />
          );
        })}
      </div>

      {gameOver && (
        <div className="text-center">
          <p className="text-xl mb-4">Game Over! Score: {score}</p>
          <Button onClick={resetGame} className="bg-accent hover:bg-accent/90">
            Play Again
          </Button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 mt-4">
        <div />
        <Button onClick={() => setDirection('UP')} className="bg-primary hover:bg-primary/90">↑</Button>
        <div />
        <Button onClick={() => setDirection('LEFT')} className="bg-primary hover:bg-primary/90">←</Button>
        <Button onClick={() => setDirection('DOWN')} className="bg-primary hover:bg-primary/90">↓</Button>
        <Button onClick={() => setDirection('RIGHT')} className="bg-primary hover:bg-primary/90">→</Button>
      </div>
    </Card>
  );
};

export default Snake;