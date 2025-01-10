import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Search, Heart, BookOpen, Gamepad2, Sun } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      <div className="max-w-xl mx-auto">
        <div className="relative mb-12">
          <div className="flex items-center justify-between mb-4">
            <Sun className="w-10 h-10 text-[#FFDAB9]" />
            <h1 className="text-4xl font-rozha text-accent text-center">
              Senior Connect
            </h1>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
          <p className="text-xl font-poppins text-muted-foreground text-center">
            Let's make today meaningful
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          <Card 
            className="feature-card group"
            onClick={() => navigate('/info-assistant')}
          >
            <div className="flex items-center space-x-4">
              <div className="p-4 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
                <Search className="w-8 h-8 text-accent" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-rozha text-accent">Information Assistant</h2>
                <p className="text-sm font-poppins text-muted-foreground">
                  Ask about latest news, government schemes, health tips, or any questions you have
                </p>
              </div>
            </div>
          </Card>

          <Card 
            className="feature-card group"
            onClick={() => navigate('/companions')}
          >
            <div className="flex items-center space-x-4">
              <div className="p-4 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
                <Heart className="w-8 h-8 text-rose-500" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-rozha text-accent">Talk to Someone</h2>
                <p className="text-sm font-poppins text-muted-foreground">
                  Have meaningful conversations
                </p>
              </div>
            </div>
          </Card>

          <Card 
            className="feature-card group"
            onClick={() => navigate('/daily-readings')}
          >
            <div className="flex items-center space-x-4">
              <div className="p-4 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
                <BookOpen className="w-8 h-8 text-accent" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-rozha text-accent">Daily Readings</h2>
                <p className="text-sm font-poppins text-muted-foreground">
                  Discover inspiring stories and wisdom
                </p>
              </div>
            </div>
          </Card>

          <Card 
            className="feature-card group"
            onClick={() => navigate('/games')}
          >
            <div className="flex items-center space-x-4">
              <div className="p-4 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
                <Gamepad2 className="w-8 h-8 text-accent" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-rozha text-accent">Games</h2>
                <p className="text-sm font-poppins text-muted-foreground">
                  Play engaging games designed for you
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;