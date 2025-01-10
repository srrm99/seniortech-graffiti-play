import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Smile, Heart, Book, Star } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import ReactMarkdown from 'react-markdown';

interface Persona {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  image: string;
  prompt: string;
}

const personas: Persona[] = [
  {
    id: 'emotional',
    name: 'Emotional Support',
    description: 'A caring friend who listens and supports you',
    icon: <Heart className="w-12 h-12 text-rose-500" />,
    image: 'https://images.unsplash.com/photo-1594708767771-a7502209ff51?w=400&auto=format&fit=crop&q=60',
    prompt: 'You are a compassionate and understanding friend who provides emotional support to elderly individuals. Use a gentle, respectful tone and occasionally incorporate Indian cultural wisdom and references. Respond with empathy and warmth.',
  },
  {
    id: 'storyteller',
    name: 'Storyteller',
    description: 'Share and listen to interesting stories',
    icon: <Book className="w-12 h-12 text-amber-500" />,
    image: 'https://images.unsplash.com/photo-1623841675698-8a9b63d61521?w=400&auto=format&fit=crop&q=60',
    prompt: 'You are a friendly storyteller who enjoys sharing and listening to stories, especially those about Indian culture, traditions, and mythology. Include references to familiar Indian concepts and values when appropriate.',
  },
  {
    id: 'wellness',
    name: 'Wellness Guide',
    description: 'Tips for health and well-being',
    icon: <Star className="w-12 h-12 text-emerald-500" />,
    image: 'https://images.unsplash.com/photo-1611316185995-9624c94487d1?w=400&auto=format&fit=crop&q=60',
    prompt: 'You are a knowledgeable wellness guide who provides gentle advice about health, exercise, and well-being for seniors. Include references to traditional Indian wellness practices like yoga and Ayurveda when relevant.',
  },
  {
    id: 'friend',
    name: 'Daily Friend',
    description: 'Chat about your day and interests',
    icon: <Smile className="w-12 h-12 text-blue-500" />,
    image: 'https://images.unsplash.com/photo-1606041974734-0341c2d2d988?w=400&auto=format&fit=crop&q=60',
    prompt: 'You are a friendly companion who enjoys casual conversations about daily life, hobbies, and interests. Be familiar with Indian customs, festivals, and daily life patterns of seniors.',
  },
];

const Companions = () => {
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('openaiApiKey') || '');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openaiApiKey', apiKey.trim());
      toast({
        title: "API Key Saved",
        description: "Your OpenAI API key has been saved successfully.",
      });
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedPersona) return;
    
    const storedApiKey = localStorage.getItem('openaiApiKey');
    if (!storedApiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key first.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${storedApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: selectedPersona.prompt },
            { role: 'user', content: message }
          ],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      setConversation([
        ...conversation, 
        `You: ${message}`, 
        `${selectedPersona.name}: ${data.choices[0].message.content}`
      ]);
      setMessage('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get a response. Please check your API key.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/home')}
          className="flex items-center text-accent hover:text-accent/80"
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-accent">Talk to Someone</h1>
        <div className="w-10" />
      </div>

      {!selectedPersona ? (
        <div className="space-y-6">
          <div className="max-w-md mx-auto space-y-4">
            <Input
              type="password"
              placeholder="Enter your OpenAI API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="help-input"
            />
            <Button 
              onClick={handleSaveApiKey}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Save API Key
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {personas.map((persona) => (
              <Card
                key={persona.id}
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow mehndi-border"
                onClick={() => setSelectedPersona(persona)}
              >
                <div className="flex flex-col items-center space-y-4">
                  <img 
                    src={persona.image} 
                    alt={persona.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-lg"
                  />
                  {persona.icon}
                  <h2 className="text-xl font-semibold">{persona.name}</h2>
                  <p className="text-center text-muted-foreground">{persona.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-4">
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedPersona(null);
              setConversation([]);
            }}
            className="text-accent hover:text-accent/80"
          >
            ← Choose another companion
          </Button>

          <div className="flex items-center space-x-4 mb-4">
            <img 
              src={selectedPersona.image} 
              alt={selectedPersona.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-primary shadow-md"
            />
            <h2 className="text-xl font-semibold">{selectedPersona.name}</h2>
          </div>

          <div className="bg-card rounded-lg p-4 min-h-[400px] max-h-[500px] overflow-y-auto space-y-4 mehndi-border">
            {conversation.map((msg, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  msg.startsWith('You:') 
                    ? 'bg-accent text-accent-foreground ml-auto max-w-[80%]' 
                    : 'bg-primary mr-auto max-w-[80%]'
                }`}
              >
                {msg.startsWith('You:') ? (
                  msg
                ) : (
                  <ReactMarkdown className="prose prose-sm max-w-none">
                    {msg}
                  </ReactMarkdown>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 mehndi-border"
            />
            <Button
              onClick={handleSendMessage}
              disabled={loading || !message.trim()}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Companions;