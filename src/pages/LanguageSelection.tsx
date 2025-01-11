import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Sun, Moon, Trophy, Star, Globe } from 'lucide-react';
import { useState } from 'react';
import { toast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

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

const labels = {
  english: {
    welcome: "Senior Connect",
    enterName: "Enter your name",
    save: "Save",
    achievements: "Achievements",
    firstSteps: "First Steps: Complete your profile",
    gameMaster: "Game Master: Win 5 games",
    dailyReader: "Daily Reader: Read 7 days in a row",
    selectLanguage: "Select Your Language"
  },
  hindi: {
    welcome: "वरिष्ठ कनेक्ट",
    enterName: "अपना नाम दर्ज करें",
    save: "सहेजें",
    achievements: "उपलब्धियां",
    firstSteps: "पहले कदम: प्रोफ़ाइल पूरा करें",
    gameMaster: "गेम मास्टर: 5 खेल जीतें",
    dailyReader: "दैनिक पाठक: लगातार 7 दिन पढ़ें",
    selectLanguage: "अपनी भाषा चुनें"
  }
};

const LanguageSelection = () => {
  const navigate = useNavigate();
  const { preferences, updateUserName, toggleTheme, setLanguage } = useUserPreferences();
  const [name, setName] = useState(preferences.userName);
  const [selectedLanguage, setSelectedLanguage] = useState<'english' | 'hindi' | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [dailyQuote, setDailyQuote] = useState('');

  const handleLanguageSelect = (language: 'english' | 'hindi') => {
    setSelectedLanguage(language);
    setLanguage(language);
    const quoteList = quotes[language];
    setDailyQuote(quoteList[Math.floor(Math.random() * quoteList.length)]);
    setShowDetails(true);
  };

  const handleNameSubmit = () => {
    if (!name.trim()) {
      toast({
        title: selectedLanguage === 'hindi' ? "कृपया नाम दर्ज करें" : "Please enter your name",
        variant: "destructive",
      });
      return;
    }

    updateUserName(name);
    const successMessage = selectedLanguage === 'hindi' 
      ? "स्वागत है!" 
      : "Welcome!";
    const description = selectedLanguage === 'hindi'
      ? `बहुत अच्छा है की आप यहाँ हैं, ${name}!`
      : `Great to have you here, ${name}!`;
    
    toast({
      title: successMessage,
      description: description,
    });

    navigate(`/index/${selectedLanguage}`);
  };

  if (!showDetails) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8"
        >
          <Globe className="w-16 h-16 mx-auto text-accent" />
          <h1 className="text-4xl font-rozha text-accent mb-8">
            Select Your Language / अपनी भाषा चुनें
          </h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              className="text-xl p-8 min-w-[200px]"
              onClick={() => handleLanguageSelect('english')}
            >
              English
            </Button>
            <Button 
              className="text-xl p-8 min-w-[200px]"
              onClick={() => handleLanguageSelect('hindi')}
            >
              हिंदी
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentLabels = labels[selectedLanguage!];

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
          <h1 className="text-4xl font-rozha text-accent">{currentLabels.welcome}</h1>
          <div className="mehndi-border">
            <p className="text-xl text-muted-foreground italic">{dailyQuote}</p>
          </div>
        </div>

        <Card className="p-6 space-y-4 bg-white/80 backdrop-blur">
          <h2 className="text-2xl font-rozha text-accent">{currentLabels.welcome}</h2>
          <div className="flex gap-2">
            <Input
              placeholder={currentLabels.enterName}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="max-w-[200px]"
            />
            <Button onClick={handleNameSubmit}>{currentLabels.save}</Button>
          </div>
        </Card>

        <Card className="p-6 bg-white/80 backdrop-blur">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-rozha text-accent">{currentLabels.achievements}</h2>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <p>{currentLabels.firstSteps}</p>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-gray-300" />
              <p>{currentLabels.gameMaster}</p>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-gray-300" />
              <p>{currentLabels.dailyReader}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LanguageSelection;