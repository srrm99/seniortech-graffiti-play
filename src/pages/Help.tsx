import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const Help = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('perplexityApiKey')}`,
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
      setResponse("I'm sorry, I couldn't process your request. Please try again.");
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
        <h1 className="text-3xl font-bold text-accent">Help & Support</h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      <Card className="p-6 space-y-4">
        <input
          type="text"
          className="help-input"
          placeholder="Enter your API key"
          onChange={(e) => localStorage.setItem('perplexityApiKey', e.target.value)}
        />
        
        <textarea
          className="help-input min-h-[100px]"
          placeholder="How can I help you today?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        
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

export default Help;