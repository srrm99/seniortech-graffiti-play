import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Gamepad2, HelpCircle, Heart } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-accent mehndi-border mb-12">
          Senior Connect
        </h1>
        
        <div className="grid grid-cols-1 gap-8">
          <Card 
            className="game-button group"
            onClick={() => navigate('/games')}
          >
            <div className="flex items-center space-x-4">
              <div className="p-4 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
                <Gamepad2 className="w-8 h-8 text-accent" />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-bold text-accent">Games</h2>
                <p className="text-sm text-muted-foreground">Play engaging games designed for you</p>
              </div>
            </div>
          </Card>

          <Card 
            className="game-button group"
            onClick={() => navigate('/companions')}
          >
            <div className="flex items-center space-x-4">
              <div className="p-4 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
                <Heart className="w-8 h-8 text-rose-500" />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-bold text-accent">Talk to Someone</h2>
                <p className="text-sm text-muted-foreground">Have meaningful conversations</p>
              </div>
            </div>
          </Card>

          <Card 
            className="game-button group"
            onClick={() => navigate('/help')}
          >
            <div className="flex items-center space-x-4">
              <div className="p-4 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
                <HelpCircle className="w-8 h-8 text-accent" />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-bold text-accent">Help & Support</h2>
                <p className="text-sm text-muted-foreground">Get assistance when you need it</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;