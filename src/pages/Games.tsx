import { useState } from 'react';
import { Card } from "@/components/ui/card";
import TicTacToe from '@/components/games/TicTacToe';
import MemoryGame from '@/components/games/MemoryGame';
import { X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Games = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const navigate = useNavigate();

  const renderGame = () => {
    switch(selectedGame) {
      case 'tictactoe':
        return <TicTacToe onClose={() => setSelectedGame(null)} />;
      case 'memory':
        return <MemoryGame onClose={() => setSelectedGame(null)} />;
      default:
        return null;
    }
  };

  if (selectedGame) {
    return (
      <div className="min-h-screen bg-background p-6">
        <button 
          onClick={() => setSelectedGame(null)}
          className="mb-4 flex items-center text-accent hover:text-accent/80"
        >
          <X className="w-6 h-6 mr-2" />
          Close Game
        </button>
        {renderGame()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/home')}
          className="flex items-center text-accent hover:text-accent/80"
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-accent">Games</h1>
        <div className="w-10" />
      </div>

      <div className="grid grid-cols-1 gap-6 max-w-xl mx-auto">
        <Card 
          className="game-button"
          onClick={() => setSelectedGame('tictactoe')}
        >
          Tic Tac Toe
        </Card>

        <Card 
          className="game-button"
          onClick={() => setSelectedGame('memory')}
        >
          Memory Cards
        </Card>
      </div>
    </div>
  );
};

export default Games;