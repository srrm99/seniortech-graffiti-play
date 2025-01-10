import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const LanguageSelection = () => {
  const navigate = useNavigate();

  const selectLanguage = (lang: string) => {
    localStorage.setItem('preferredLanguage', lang);
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center space-y-8">
      <div className="text-center space-y-4 mehndi-border p-6">
        <h1 className="text-4xl font-bold text-accent">Welcome | नमस्ते | வணக்கம்</h1>
        <p className="text-xl text-muted-foreground">Please select your language</p>
      </div>
      
      <Card className="w-full max-w-md p-6 space-y-4 bg-white/80 backdrop-blur">
        <Button 
          className="w-full text-xl p-6 bg-primary hover:bg-primary/90"
          onClick={() => selectLanguage('english')}
        >
          English
        </Button>
        
        <Button 
          className="w-full text-xl p-6 bg-primary hover:bg-primary/90"
          onClick={() => selectLanguage('hindi')}
        >
          हिंदी
        </Button>
        
        <Button 
          className="w-full text-xl p-6 bg-primary hover:bg-primary/90"
          onClick={() => selectLanguage('tamil')}
        >
          தமிழ்
        </Button>
      </Card>
    </div>
  );
};

export default LanguageSelection;