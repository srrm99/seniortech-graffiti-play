import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Sun, Moon, Trophy, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";

const quotes = [
  "Age is just a number, but wisdom is a choice.",
  "Every day is a new opportunity to learn and grow.",
  "The best way to predict the future is to create it.",
  "Life begins at the end of your comfort zone.",
];

const LanguageSelection = () => {
  const navigate = useNavigate();
  const { preferences, updateUserName, toggleTheme, toggleFavorite } = useUserPreferences();
  const [name, setName] = useState(preferences.userName);
  const [dailyQuote, setDailyQuote] = useState('');

  useEffect(() => {
    // Set random daily quote
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setDailyQuote(randomQuote);
  }, []);

  const handleNameSubmit = () => {
    updateUserName(name);
    toast({
      title: "Welcome!",
      description: `Great to have you here, ${name}!`,
    });
  };

  const handleLanguageSelect = (language: string) => {
    // Add achievement for first-time setup
    if (!preferences.userName) {
      toast({
        title: "Achievement Unlocked! 🏆",
        description: "First Steps: Completed your profile setup!",
      });
    }
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      <div className="max-w-xl mx-auto space-y-8">
        {/* Theme Toggle */}
        <div className="flex justify-end">
          {preferences.theme === 'light' ? (
            <Sun className="w-8 h-8 text-yellow-500 cursor-pointer" onClick={toggleTheme} />
          ) : (
            <Moon className="w-8 h-8 text-blue-300 cursor-pointer" onClick={toggleTheme} />
          )}
        </div>

        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-rozha text-accent">Senior Connect</h1>
          <div className="mehndi-border">
            <p className="text-xl text-muted-foreground italic">{dailyQuote}</p>
          </div>
        </div>

        {/* Personalization Section */}
        <Card className="p-6 space-y-4 bg-white/80 backdrop-blur">
          <h2 className="text-2xl font-rozha text-accent">Welcome!</h2>
          <div className="flex gap-2">
            <Input
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="max-w-[200px]"
            />
            <Button onClick={handleNameSubmit}>Save</Button>
          </div>
        </Card>

        {/* Achievements Section */}
        <Card className="p-6 bg-white/80 backdrop-blur">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-rozha text-accent">Achievements</h2>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <p>First Steps: Complete your profile</p>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-gray-300" />
              <p>Game Master: Win 5 games</p>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-gray-300" />
              <p>Daily Reader: Read 7 days in a row</p>
            </div>
          </div>
        </Card>

        {/* Language Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            className="p-6 text-xl hover:scale-105 transition-transform"
            onClick={() => handleLanguageSelect('english')}
          >
            English
          </Button>
          <Button 
            className="p-6 text-xl hover:scale-105 transition-transform"
            onClick={() => handleLanguageSelect('hindi')}
          >
            हिंदी
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;