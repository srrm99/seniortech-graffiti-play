import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Sun, Moon, Trophy, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";

const quotes = {
  english: [
    "Age is just a number, but wisdom is a choice.",
    "Every day is a new opportunity to learn and grow.",
    "The best way to predict the future is to create it.",
    "Life begins at the end of your comfort zone.",
  ],
  hindi: [
    "उम्र एक संख्या है, लेकिन ज्ञान एक विकल्प है।",
    "हर दिन सीखने और बढ़ने का एक नया अवसर है।",
    "भविष्य की भविष्यवाणी करने का सबसे अच्छा तरीका है इसे बनाना।",
    "जीवन आपके आराम क्षेत्र के अंत में शुरू होता है।",
  ]
};

const LanguageSelection = () => {
  const navigate = useNavigate();
  const { preferences, updateUserName, toggleTheme, setLanguage } = useUserPreferences();
  const [name, setName] = useState(preferences.userName);
  const [dailyQuote, setDailyQuote] = useState('');

  useEffect(() => {
    const quoteList = quotes[preferences.language || 'english'];
    const randomQuote = quoteList[Math.floor(Math.random() * quoteList.length)];
    setDailyQuote(randomQuote);
  }, [preferences.language]);

  const handleNameSubmit = () => {
    updateUserName(name);
    toast({
      title: preferences.language === 'hindi' ? "स्वागत है!" : "Welcome!",
      description: preferences.language === 'hindi' 
        ? `बहुत अच्छा है की आप यहाँ हैं, ${name}!`
        : `Great to have you here, ${name}!`,
    });
  };

  const handleLanguageSelect = (language: 'english' | 'hindi') => {
    setLanguage(language);
    if (!preferences.userName) {
      toast({
        title: language === 'hindi' ? "उपलब्धि अनलॉक! 🏆" : "Achievement Unlocked! 🏆",
        description: language === 'hindi' 
          ? "पहले कदम: आपका प्रोफ़ाइल सेटअप पूरा हो गया!"
          : "First Steps: Completed your profile setup!",
      });
    }
    navigate('/home');
  };

  const labels = {
    welcome: preferences.language === 'hindi' ? "वरिष्ठ कनेक्ट" : "Senior Connect",
    enterName: preferences.language === 'hindi' ? "अपना नाम दर्ज करें" : "Enter your name",
    save: preferences.language === 'hindi' ? "सहेजें" : "Save",
    achievements: preferences.language === 'hindi' ? "उपलब्धियां" : "Achievements",
    firstSteps: preferences.language === 'hindi' ? "पहले कदम: प्रोफ़ाइल पूरा करें" : "First Steps: Complete your profile",
    gameMaster: preferences.language === 'hindi' ? "गेम मास्टर: 5 खेल जीतें" : "Game Master: Win 5 games",
    dailyReader: preferences.language === 'hindi' ? "दैनिक पाठक: लगातार 7 दिन पढ़ें" : "Daily Reader: Read 7 days in a row"
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      <div className="max-w-xl mx-auto space-y-8">
        <div className="flex justify-end">
          {preferences.theme === 'light' ? (
            <Sun className="w-8 h-8 text-yellow-500 cursor-pointer" onClick={toggleTheme} />
          ) : (
            <Moon className="w-8 h-8 text-blue-300 cursor-pointer" onClick={toggleTheme} />
          )}
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-4xl font-rozha text-accent">{labels.welcome}</h1>
          <div className="mehndi-border">
            <p className="text-xl text-muted-foreground italic">{dailyQuote}</p>
          </div>
        </div>

        <Card className="p-6 space-y-4 bg-white/80 backdrop-blur">
          <h2 className="text-2xl font-rozha text-accent">{labels.welcome}</h2>
          <div className="flex gap-2">
            <Input
              placeholder={labels.enterName}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="max-w-[200px]"
            />
            <Button onClick={handleNameSubmit}>{labels.save}</Button>
          </div>
        </Card>

        <Card className="p-6 bg-white/80 backdrop-blur">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-rozha text-accent">{labels.achievements}</h2>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <p>{labels.firstSteps}</p>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-gray-300" />
              <p>{labels.gameMaster}</p>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-gray-300" />
              <p>{labels.dailyReader}</p>
            </div>
          </div>
        </Card>

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