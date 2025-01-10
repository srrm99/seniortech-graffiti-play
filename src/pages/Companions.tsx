import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import OpenAI from 'openai';
import { useConversation } from '@11labs/react';

type Persona = {
  id: string;
  name: string;
  role: string;
  description: string;
  voiceId: string;
  prompt: string;
};

const personas: Persona[] = [
  {
    id: 'emotional-support',
    name: 'Meera',
    role: 'Emotional Support Guide',
    description: 'A compassionate listener who helps you navigate through emotional challenges with wisdom from Indian traditions',
    voiceId: 'EXAVITQu4vr4xnSDxMaL',
    prompt: 'You are Meera, a warm and empathetic emotional support guide who draws wisdom from Indian traditions. You speak with gentle understanding and offer support with references to mindfulness and ancient Indian wisdom.'
  },
  {
    id: 'motivation',
    name: 'Arjun',
    role: 'Motivational Coach',
    description: 'An energetic motivator who inspires you with teachings from the Bhagavad Gita and modern success principles',
    voiceId: 'TX3LPaxmHKxFdv7VOQHJ',
    prompt: 'You are Arjun, a motivational coach who combines teachings from the Bhagavad Gita with modern principles of success. You speak with enthusiasm and conviction, inspiring others to reach their full potential.'
  },
  {
    id: 'wellness',
    name: 'Ayush',
    role: 'Wellness Guide',
    description: 'A knowledgeable advisor on holistic health, combining Ayurvedic wisdom with modern wellness practices',
    voiceId: 'onwK4e9ZLuTAKqWW03F9',
    prompt: 'You are Ayush, a wellness guide well-versed in both Ayurvedic principles and modern health practices. You provide practical advice for maintaining physical and mental well-being.'
  },
  {
    id: 'spiritual',
    name: 'Deepa',
    role: 'Spiritual Guide',
    description: 'A gentle spiritual mentor who shares insights from various Indian philosophical traditions',
    voiceId: 'XB0fDUnXU5powFXDhCwa',
    prompt: 'You are Deepa, a spiritual guide who shares wisdom from various Indian philosophical traditions. You help others find peace and meaning through spiritual understanding.'
  }
];

const Companions = () => {
  const [openaiApiKey, setOpenaiApiKey] = useState<string>(localStorage.getItem('openai-api-key') || '');
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState<string>(localStorage.getItem('elevenlabs-api-key') || '');
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [message, setMessage] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const conversation = useConversation();

  const handleApiKeysSubmit = () => {
    if (openaiApiKey.trim() && elevenLabsApiKey.trim()) {
      localStorage.setItem('openai-api-key', openaiApiKey.trim());
      localStorage.setItem('elevenlabs-api-key', elevenLabsApiKey.trim());
      toast({
        title: "Success",
        description: "API Keys saved successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Please enter both API keys",
        variant: "destructive",
      });
    }
  };

  const handlePersonaSelect = async (persona: Persona) => {
    setSelectedPersona(persona);
    try {
      await conversation.startSession({
        agentId: "your_agent_id",
        overrides: {
          tts: {
            voiceId: persona.voiceId
          }
        }
      });
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: "Error",
        description: "Failed to initialize voice chat. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedPersona) return;

    const storedOpenaiKey = localStorage.getItem('openai-api-key');
    if (!storedOpenaiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key first",
        variant: "destructive",
      });
      return;
    }

    try {
      // Initialize OpenAI with the stored API key
      const openai = new OpenAI({
        apiKey: storedOpenaiKey,
        dangerouslyAllowBrowser: true
      });

      // Make the API call
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: selectedPersona.prompt
          },
          {
            role: "user",
            content: message
          }
        ],
      });

      const reply = response.choices[0]?.message?.content;
      
      if (reply) {
        setIsSpeaking(true);
        // Start a new session with the reply as the first message
        await conversation.startSession({
          agentId: "your_agent_id",
          overrides: {
            agent: {
              firstMessage: reply
            },
            tts: {
              voiceId: selectedPersona.voiceId
            }
          }
        });
        setIsSpeaking(false);
        // Clear the message input after sending
        setMessage('');
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to process your message. Please try again.",
        variant: "destructive",
      });
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

        {(!openaiApiKey || !elevenLabsApiKey) && (
          <div className="space-y-4 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold">Enter Your API Keys</h2>
            <p className="text-muted-foreground">Both API keys are required to chat with our companions.</p>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">OpenAI API Key</label>
                <Input
                  type="password"
                  value={openaiApiKey}
                  onChange={(e) => setOpenaiApiKey(e.target.value)}
                  placeholder="Enter your OpenAI API key"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">ElevenLabs API Key</label>
                <Input
                  type="password"
                  value={elevenLabsApiKey}
                  onChange={(e) => setElevenLabsApiKey(e.target.value)}
                  placeholder="Enter your ElevenLabs API key"
                />
              </div>
              <Button onClick={handleApiKeysSubmit}>Save Keys</Button>
            </div>
          </div>
        )}

        {openaiApiKey && elevenLabsApiKey && !selectedPersona && (
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
                {isSpeaking ? (
                  <Volume2 className="w-6 h-6 text-accent animate-pulse" />
                ) : (
                  <VolumeX className="w-6 h-6 text-muted-foreground" />
                )}
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