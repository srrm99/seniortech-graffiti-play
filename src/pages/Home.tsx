import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Search, Heart, BookOpen, Gamepad2, Sun, Phone, User, Hospital, PhoneCall, Moon, Star } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const { preferences, updateUserName, toggleTheme, toggleFavorite, isFavorite } = useUserPreferences();
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(preferences.userName);

  const handleCall = (name: string, number: string) => {
    toast({
      title: `Calling ${name}`,
      description: `Dialing ${number}...`,
    });
  };

  const handleNameSubmit = () => {
    updateUserName(tempName);
    setIsEditingName(false);
    toast({
      title: "Name Updated",
      description: `Welcome, ${tempName}!`,
    });
  };

  const features = [
    { id: 'info-assistant', title: 'Information Assistant', icon: Search, path: '/info-assistant' },
    { id: 'companions', title: 'Talk to Someone', icon: Heart, path: '/companions' },
    { id: 'daily-readings', title: 'Daily Readings', icon: BookOpen, path: '/daily-readings' },
    { id: 'games', title: 'Games', icon: Gamepad2, path: '/games' },
  ];

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      <div className="max-w-xl mx-auto">
        <div className="relative mb-8">
          <div className="flex items-center justify-between mb-4">
            {preferences.theme === 'light' ? (
              <Sun className="w-10 h-10 text-[#FFDAB9] cursor-pointer" onClick={toggleTheme} />
            ) : (
              <Moon className="w-10 h-10 text-[#FFDAB9] cursor-pointer" onClick={toggleTheme} />
            )}
            <h1 className="text-4xl font-rozha text-accent text-center">
              Senior Connect
            </h1>
            <div className="w-10" />
          </div>
          {isEditingName ? (
            <div className="flex items-center gap-2 justify-center">
              <Input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Enter your name"
                className="max-w-[200px]"
              />
              <Button onClick={handleNameSubmit}>Save</Button>
            </div>
          ) : (
            <p className="text-xl font-poppins text-muted-foreground text-center cursor-pointer" onClick={() => setIsEditingName(true)}>
              {preferences.userName ? `Welcome, ${preferences.userName}!` : "Click to add your name"}
            </p>
          )}
        </div>

        {/* Emergency Contacts Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-rozha text-accent mb-4">Emergency Contacts</h2>
          <div className="grid grid-cols-2 gap-4">
            <Card 
              className="p-4 cursor-pointer hover:shadow-lg transition-shadow bg-white"
              onClick={() => handleCall("Beta", "+91 98765 43210")}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-primary/20">
                  <User className="w-6 h-6 text-accent" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-accent">Beta</p>
                  <p className="text-sm text-muted-foreground">+91 98765 43210</p>
                </div>
              </div>
            </Card>

            <Card 
              className="p-4 cursor-pointer hover:shadow-lg transition-shadow bg-white"
              onClick={() => handleCall("Behan", "+91 98765 43211")}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-primary/20">
                  <User className="w-6 h-6 text-accent" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-accent">Behan</p>
                  <p className="text-sm text-muted-foreground">+91 98765 43211</p>
                </div>
              </div>
            </Card>

            <Card 
              className="p-4 cursor-pointer hover:shadow-lg transition-shadow bg-white"
              onClick={() => handleCall("Local Hospital", "102")}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-primary/20">
                  <Hospital className="w-6 h-6 text-accent" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-accent">Hospital</p>
                  <p className="text-sm text-muted-foreground">102</p>
                </div>
              </div>
            </Card>

            <Card 
              className="p-4 cursor-pointer hover:shadow-lg transition-shadow bg-white"
              onClick={() => handleCall("Ambulance", "108")}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-primary/20">
                  <PhoneCall className="w-6 h-6 text-accent" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-accent">Ambulance</p>
                  <p className="text-sm text-muted-foreground">108</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        {/* Favorites Section */}
        {preferences.favorites.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-rozha text-accent mb-4">Your Favorites</h2>
            <div className="grid grid-cols-1 gap-4">
              {features
                .filter(feature => isFavorite(feature.id))
                .map(feature => (
                  <Card 
                    key={feature.id}
                    className="feature-card group"
                    onClick={() => navigate(feature.path)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-4 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
                        <feature.icon className="w-8 h-8 text-accent" />
                      </div>
                      <div className="text-left">
                        <h2 className="text-2xl font-rozha text-accent">{feature.title}</h2>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* Main Features */}
        <div className="grid grid-cols-1 gap-8">
          {features.map(feature => (
            <Card 
              key={feature.id}
              className="feature-card group relative"
              onClick={() => navigate(feature.path)}
            >
              <div className="flex items-center space-x-4">
                <div className="p-4 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
                  <feature.icon className="w-8 h-8 text-accent" />
                </div>
                <div className="text-left">
                  <h2 className="text-2xl font-rozha text-accent">{feature.title}</h2>
                </div>
              </div>
              <Star
                className={`absolute top-4 right-4 w-6 h-6 cursor-pointer ${
                  isFavorite(feature.id) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(feature.id);
                  toast({
                    title: isFavorite(feature.id) ? "Removed from favorites" : "Added to favorites",
                    description: `${feature.title} has been ${isFavorite(feature.id) ? "removed from" : "added to"} your favorites.`,
                  });
                }}
              />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
