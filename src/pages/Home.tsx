import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Gamepad2, Search, Heart, Music2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const handleDevotionalClick = () => {
    const savedApiKey = localStorage.getItem('youtube_api_key');
    if (savedApiKey) {
      navigate('/companions');
    } else {
      setShowApiKeyDialog(true);
    }
  };

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      localStorage.setItem('youtube_api_key', apiKey.trim());
      setShowApiKeyDialog(false);
      toast({
        title: "API Key Saved",
        description: "Your YouTube API key has been saved successfully.",
      });
      navigate('/companions');
    } else {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-8 bg-pattern">
      <div className="max-w-xl mx-auto">
        <div className="relative mb-12">
          <h1 className="text-5xl font-rozha text-accent text-center mb-4">
            Senior Connect
          </h1>
          <p className="text-lg font-poppins text-muted-foreground text-center">
            Your companion for meaningful connections
          </p>
          <div className="absolute -top-6 -left-6 w-24 h-24 opacity-10 bg-contain bg-no-repeat"
               style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 90c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40z' fill='%23d946ef'/%3E%3C/svg%3E')" }}>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 opacity-10 bg-contain bg-no-repeat rotate-45"
               style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 90c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40z' fill='%23d946ef'/%3E%3C/svg%3E')" }}>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          <Card 
            className="game-button group transform transition-all duration-300 hover:scale-105"
            onClick={() => navigate('/games')}
          >
            <div className="flex items-center space-x-4">
              <div className="p-4 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
                <Gamepad2 className="w-8 h-8 text-accent" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-rozha text-accent">Games</h2>
                <p className="text-sm font-poppins text-muted-foreground">Play engaging games designed for you</p>
              </div>
            </div>
          </Card>

          <Card 
            className="game-button group transform transition-all duration-300 hover:scale-105"
            onClick={handleDevotionalClick}
          >
            <div className="flex items-center space-x-4">
              <div className="p-4 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
                <Music2 className="w-8 h-8 text-accent" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-rozha text-accent">Devotional Songs</h2>
                <p className="text-sm font-poppins text-muted-foreground">Listen to peaceful devotional music</p>
              </div>
            </div>
          </Card>

          <Card 
            className="game-button group transform transition-all duration-300 hover:scale-105"
            onClick={() => navigate('/companions')}
          >
            <div className="flex items-center space-x-4">
              <div className="p-4 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
                <Heart className="w-8 h-8 text-rose-500" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-rozha text-accent">Talk to Someone</h2>
                <p className="text-sm font-poppins text-muted-foreground">Have meaningful conversations</p>
              </div>
            </div>
          </Card>

          <Card 
            className="game-button group transform transition-all duration-300 hover:scale-105"
            onClick={() => navigate('/info-assistant')}
          >
            <div className="flex items-center space-x-4">
              <div className="p-4 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
                <Search className="w-8 h-8 text-accent" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-rozha text-accent">Information Assistant</h2>
                <p className="text-sm font-poppins text-muted-foreground">Get instant answers to your questions</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <AlertDialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>YouTube API Key Required</AlertDialogTitle>
            <AlertDialogDescription>
              To access devotional songs, please enter your YouTube Data API key. You can get one from the Google Cloud Console.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            type="text"
            placeholder="Enter your YouTube API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="my-4"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleApiKeySubmit}>Save & Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Home;