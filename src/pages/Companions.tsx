import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send, Smile, Heart, Book, Star } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface Persona {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  prompt: string;
}

const personas: Persona[] = [
  {
    id: 'emotional',
    name: 'Emotional Support',
    description: 'A caring friend who listens and supports you',
    icon: <Heart className="w-12 h-12 text-rose-500" />,
    prompt: 'You are a compassionate and understanding friend who provides emotional support to elderly individuals. Respond with empathy and warmth.',
  },
  {
    id: 'storyteller',
    name: 'Storyteller',
    description: 'Share and listen to interesting stories',
    icon: <Book className="w-12 h-12 text-amber-500" />,
    prompt: 'You are a friendly storyteller who enjoys sharing and listening to stories, especially those about Indian culture and traditions.',
  },
  {
    id: 'wellness',
    name: 'Wellness Guide',
    description: 'Tips for health and well-being',
    icon: <Star className="w-12 h-12 text-emerald-500" />,
    prompt: 'You are a knowledgeable wellness guide who provides gentle advice about health, exercise, and well-being for seniors.',
  },
  {
    id: 'friend',
    name: 'Daily Friend',
    description: 'Chat about your day and interests',
    icon: <Smile className="w-12 h-12 text-blue-500" />,
    prompt: 'You are a friendly companion who enjoys casual conversations about daily life, hobbies, and interests.',
  },
];

const Companions = () => {
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedPersona) return;

    setLoading(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('openaiApiKey')}`,
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
      setConversation([...conversation, `You: ${message}`, `${selectedPersona.name}: ${data.choices[0].message.content}`]);
      setMessage('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Please make sure you've set your OpenAI API key in the settings.",
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {personas.map((persona) => (
            <Card
              key={persona.id}
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedPersona(persona)}
            >
              <div className="flex flex-col items-center space-y-4">
                {persona.icon}
                <h2 className="text-xl font-semibold">{persona.name}</h2>
                <p className="text-center text-muted-foreground">{persona.description}</p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-4">
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedPersona(null);
              setConversation([]);
            }}
          >
            ← Choose another companion
          </Button>

          <div className="bg-card rounded-lg p-4 min-h-[400px] max-h-[500px] overflow-y-auto space-y-4">
            {conversation.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  msg.startsWith('You:') ? 'bg-accent text-accent-foreground ml-auto max-w-[80%]' : 'bg-muted mr-auto max-w-[80%]'
                }`}
              >
                {msg}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={loading || !message.trim()}
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