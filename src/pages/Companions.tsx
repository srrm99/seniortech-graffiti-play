import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ReactMarkdown from 'react-markdown';

type Persona = {
  id: string;
  name: string;
  role: string;
  description: string;
  prompt: string;
};

const personas: Persona[] = [
  {
    id: 'emotional-support',
    name: 'Meera',
    role: 'Emotional Support Guide',
    description: 'A compassionate listener who helps you navigate through emotional challenges with wisdom from Indian traditions',
    prompt: 'You are Meera, a warm and empathetic emotional support guide who draws wisdom from Indian traditions. You speak with gentle understanding and offer support with references to mindfulness and ancient Indian wisdom.'
  },
  {
    id: 'motivation',
    name: 'Arjun',
    role: 'Motivational Coach',
    description: 'An energetic motivator who inspires you with teachings from the Bhagavad Gita and modern success principles',
    prompt: 'You are Arjun, a motivational coach who combines teachings from the Bhagavad Gita with modern principles of success. You speak with enthusiasm and conviction, inspiring others to reach their full potential.'
  },
  {
    id: 'wellness',
    name: 'Ayush',
    role: 'Wellness Guide',
    description: 'A knowledgeable advisor on holistic health, combining Ayurvedic wisdom with modern wellness practices',
    prompt: 'You are Ayush, a wellness guide well-versed in both Ayurvedic principles and modern health practices. You provide practical advice for maintaining physical and mental well-being.'
  },
  {
    id: 'spiritual',
    name: 'Deepa',
    role: 'Spiritual Guide',
    description: 'A gentle spiritual mentor who shares insights from various Indian philosophical traditions',
    prompt: 'You are Deepa, a spiritual guide who shares wisdom from various Indian philosophical traditions. You help others find peace and meaning through spiritual understanding.'
  }
];

const Companions = () => {
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [message, setMessage] = useState<string>('');
  const [conversation, setConversationHistory] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const LOCAL_LLM_URL = "https://johnaic.pplus.ai/openai/chat/completions";
  const LOCAL_LLM_API_KEY = "your-hardcoded-api-key-here"; // Replace with your actual API key

  const handlePersonaSelect = (persona: Persona) => {
    setSelectedPersona(persona);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedPersona) return;

    const userMessage = { role: 'user' as const, content: message };
    setConversationHistory(prev => [...prev, userMessage]);
    setMessage('');
    setIsStreaming(true);

    try {
      const response = await fetch(`${LOCAL_LLM_URL}?bypass_filter=false`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${LOCAL_LLM_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "neuralmagic/Meta-Llama-3.1-8B-Instruct-FP8",
          messages: [
            {
              role: "system",
              content: selectedPersona.prompt
            },
            ...conversation,
            userMessage
          ],
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      let accumulatedResponse = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split('\n').filter(line => line.trim() !== '');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonStr = line.slice(6);
              if (jsonStr === '[DONE]') continue;
              
              try {
                const data = JSON.parse(jsonStr);
                const content = data.choices?.[0]?.delta?.content || '';
                accumulatedResponse += content;
                
                setConversationHistory(prev => {
                  const newHistory = [...prev];
                  const lastMessage = newHistory[newHistory.length - 1];
                  if (lastMessage && lastMessage.role === 'assistant') {
                    lastMessage.content = accumulatedResponse;
                  } else {
                    newHistory.push({ role: 'assistant', content: accumulatedResponse });
                  }
                  return newHistory;
                });
              } catch (e) {
                console.error('Error parsing streaming response:', e);
              }
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to process your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="min-h-screen bg-pattern p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/home')}
            className="flex items-center text-accent hover:text-accent/80"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            Back
          </button>
          <h1 className="text-4xl font-rozha text-accent">Talk to Someone</h1>
          <div className="w-10" />
        </div>

        {!selectedPersona && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {personas.map((persona) => (
              <Card
                key={persona.id}
                className="cursor-pointer hover:border-accent transition-colors"
                onClick={() => handlePersonaSelect(persona)}
              >
                <CardContent className="p-6">
                  <h3 className="text-2xl font-rozha text-accent mb-2">{persona.name}</h3>
                  <p className="text-lg font-semibold mb-2">{persona.role}</p>
                  <p className="text-muted-foreground">{persona.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedPersona && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-rozha text-accent">{selectedPersona.name}</h2>
                  <p className="text-muted-foreground">{selectedPersona.role}</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto p-4">
                {conversation.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-primary/10 ml-12'
                        : 'bg-accent/10 mr-12'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown 
                        className="prose prose-sm max-w-none dark:prose-invert"
                      >
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                    {msg.role === 'assistant' && index === conversation.length - 1 && isStreaming && (
                      <span className="inline-block animate-pulse">▊</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                />
                <Button onClick={handleSendMessage}>Send</Button>
              </div>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSelectedPersona(null)}
              >
                Choose Different Companion
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Companions;