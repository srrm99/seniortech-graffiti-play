import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { toast } from "@/components/ui/use-toast";

const Help = () => {
  const navigate = useNavigate();
  const { preferences } = useUserPreferences();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) {
      const message = preferences.language === 'english'
        ? "Please enter your question"
        : "कृपया अपना प्रश्न दर्ज करें";
      
      toast({
        title: message,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: preferences.language === 'english'
                ? 'You are a helpful assistant for senior citizens. Provide clear, simple explanations with large, easy-to-read formatting. Focus on practical information about news, government schemes, health tips, and general knowledge.'
                : 'आप वरिष्ठ नागरिकों के लिए एक सहायक सहायक हैं। बड़े, पढ़ने में आसान प्रारूप के साथ स्पष्ट, सरल स्पष्टीकरण प्रदान करें। समाचार, सरकारी योजनाओं, स्वास्थ्य युक्तियों और सामान्य ज्ञान के बारे में व्यावहारिक जानकारी पर ध्यान दें।'
            },
            {
              role: 'user',
              content: query
            }
          ],
          temperature: 0.2,
          max_tokens: 1000,
        }),
      });

      const data = await response.json();
      setResult(data.choices[0].message.content);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = preferences.language === 'english'
        ? "Sorry, there was an error. Please try again."
        : "क्षमा करें, एक त्रुटि हुई। कृपया पुनः प्रयास करें।";
      
      toast({
        title: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pattern p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => navigate("/home")}
          >
            <ArrowLeft className="w-5 h-5" />
            {preferences.language === 'english' ? 'Back to Home' : 'होम पर वापस जाएं'}
          </Button>
        </div>

        <Card className="p-6 space-y-6">
          <h1 className="text-3xl font-rozha text-accent text-center">
            {preferences.language === 'english' ? 'Ask Anything' : 'कुछ भी पूछें'}
          </h1>
          
          <p className="text-center text-lg text-muted-foreground">
            {preferences.language === 'english'
              ? "Get information about news, government schemes, or any topic you're interested in"
              : "समाचार, सरकारी योजनाओं या किसी भी विषय के बारे में जानकारी प्राप्त करें"}
          </p>

          <div className="flex gap-4">
            <Input
              className="text-lg p-6"
              placeholder={preferences.language === 'english' 
                ? "Type your question here..."
                : "यहां अपना प्रश्न टाइप करें..."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button 
              className="text-lg px-8"
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading 
                ? (preferences.language === 'english' ? 'Searching...' : 'खोज रहा है...')
                : (preferences.language === 'english' ? 'Search' : 'खोजें')}
            </Button>
          </div>

          {result && (
            <Card className="p-6 mt-6">
              <div className="prose prose-lg max-w-none">
                <div className="text-lg leading-relaxed whitespace-pre-wrap">
                  {result}
                </div>
              </div>
            </Card>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Help;