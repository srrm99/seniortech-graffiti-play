import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Mic, MicOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useToast } from "@/components/ui/use-toast";

const InfoAssistant = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  let recognition: SpeechRecognition | null = null;

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognitionAPI();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Error",
          description: "Failed to recognize speech. Please try again.",
          variant: "destructive",
        });
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const handleSubmit = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant for senior citizens in India. Be respectful, patient, and clear in your responses. Format your responses in markdown for better readability.'
            },
            {
              role: 'user',
              content: query
            }
          ],
          temperature: 0.7,
        }),
      });
      
      const data = await response.json();
      setResponse(data.choices[0].message.content);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again later.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/home')}
          className="flex items-center text-accent hover:text-accent/80"
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
          Back
        </button>
        <h1 className="text-3xl font-rozha text-accent">Information Assistant</h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      <Card className="p-6 space-y-4 mehndi-border">
        <div className="relative">
          <textarea
            className="help-input min-h-[100px]"
            placeholder="Ask me anything - news, services, or general information..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button 
            className="absolute right-2 bottom-2 bg-accent hover:bg-accent/90"
            onClick={toggleListening}
            variant="ghost"
            size="icon"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
        </div>
        
        <Button 
          className="w-full bg-accent hover:bg-accent/90"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Thinking...' : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send
            </>
          )}
        </Button>

        {response && (
          <Card className="p-4 mt-4 prose prose-sm max-w-none">
            <ReactMarkdown>{response}</ReactMarkdown>
          </Card>
        )}
      </Card>
    </div>
  );
};

export default InfoAssistant;