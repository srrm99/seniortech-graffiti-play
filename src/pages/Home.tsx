import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Gamepad2, HelpCircle, Heart } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center text-accent mehndi-border p-4">
        Senior Connect
      </h1>
      
      <div className="grid grid-cols-1 gap-6 max-w-xl mx-auto">
        <Card 
          className="game-button"
          onClick={() => navigate('/games')}
        >
          <Gamepad2 className="w-12 h-12 mb-2 mx-auto" />
          <span className="block text-center">Games</span>
        </Card>

        <Card 
          className="game-button"
          onClick={() => navigate('/companions')}
        >
          <Heart className="w-12 h-12 mb-2 mx-auto text-rose-500" />
          <span className="block text-center">Talk to Someone</span>
        </Card>

        <Card 
          className="game-button"
          onClick={() => navigate('/help')}
        >
          <HelpCircle className="w-12 h-12 mb-2 mx-auto" />
          <span className="block text-center">Help & Support</span>
        </Card>
      </div>
    </div>
  );
};

export default Home;