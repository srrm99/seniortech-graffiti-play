import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Props {
  onClose: () => void;
}

const MemoryGame = ({ onClose }: Props) => {
  const [cards, setCards] = useState<Array<{ id: number; value: string; flipped: boolean; matched: boolean }>>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const symbols = ['🌸', '🌺', '🌻', '🌹', '🌷', '🍀', '🌼', '🌿'];

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const duplicatedSymbols = [...symbols, ...symbols];
    const shuffledSymbols = duplicatedSymbols.sort(() => Math.random() - 0.5);
    
    setCards(shuffledSymbols.map((symbol, index) => ({
      id: index,
      value: symbol,
      flipped: false,
      matched: false
    })));
    
    setFlippedCards([]);
    setMoves(0);
    setGameComplete(false);
  };

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2 || cards[id].flipped || cards[id].matched) return;

    const newCards = [...cards];
    newCards[id].flipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      
      const [firstId, secondId] = newFlippedCards;
      if (cards[firstId].value === cards[secondId].value) {
        // Match found
        setTimeout(() => {
          const newCards = [...cards];
          newCards[firstId].matched = true;
          newCards[secondId].matched = true;
          setCards(newCards);
          setFlippedCards([]);

          // Check if game is complete
          if (newCards.every(card => card.matched)) {
            setGameComplete(true);
          }
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          const newCards = [...cards];
          newCards[firstId].flipped = false;
          newCards[secondId].flipped = false;
          setCards(newCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">Memory Game</h2>
      <div className="text-xl text-center mb-4">Moves: {moves}</div>
      
      <div className="grid grid-cols-4 gap-2 mb-4">
        {cards.map(card => (
          <Button
            key={card.id}
            className={`h-20 text-2xl ${
              card.flipped || card.matched
                ? 'bg-primary hover:bg-primary/90'
                : 'bg-accent hover:bg-accent/90'
            }`}
            onClick={() => handleCardClick(card.id)}
          >
            {(card.flipped || card.matched) ? card.value : '?'}
          </Button>
        ))}
      </div>

      {gameComplete && (
        <div className="text-center">
          <p className="text-xl mb-4">Congratulations! You won in {moves} moves!</p>
          <Button onClick={initializeGame} className="bg-accent hover:bg-accent/90">
            Play Again
          </Button>
        </div>
      )}
    </Card>
  );
};

export default MemoryGame;