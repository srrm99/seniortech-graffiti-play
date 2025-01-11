import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Mic, MicOff, VolumeIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ReactMarkdown from 'react-markdown';
import VoiceChat from '@/components/voice-chat/VoiceChat';
import ChatModeSelect from '@/components/voice-chat/ChatModeSelect';

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
    name: 'Sarah',
    role: 'Emotional Support Guide',
    description: 'A compassionate listener who helps with emotional challenges using mindfulness techniques',
    prompt: 'You are Sarah, a warm and empathetic emotional support guide. You speak with gentle understanding and offer support with references to mindfulness and wellness practices. Please respond in English with a compassionate and supportive tone.'
  },
  {
    id: 'motivation',
    name: 'Michael',
    role: 'Motivational Coach',
    description: 'An energetic motivator who combines ancient wisdom with modern success principles',
    prompt: 'You are Michael, a motivational coach who combines timeless wisdom with modern principles of success. You speak with enthusiasm and conviction in English, inspiring others to reach their full potential.'
  },
  {
    id: 'wellness',
    name: 'Emma',
    role: 'Wellness Guide',
    description: 'A knowledgeable advisor combining holistic and modern health practices',
    prompt: 'You are Emma, a wellness guide well-versed in both holistic and modern health practices. You provide practical advice for maintaining physical and mental well-being in English.'
  },
  {
    id: 'spiritual',
    name: 'David',
    role: 'Spiritual Guide',
    description: 'A gentle spiritual mentor sharing insights from various philosophical traditions',
    prompt: 'You are David, a spiritual guide who shares wisdom from various philosophical traditions in English. You help others find peace and meaning through spiritual understanding.'
  }
];

const Companions = () => {
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [chatMode, setChatMode] = useState<'text' | 'voice' | null>(null);
  const [message, setMessage] = useState<string>('');
  const [conversation, setConversationHistory] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const LOCAL_LLM_URL = "https://johnaic.pplus.ai/openai/chat/completions";
  const LOCAL_LLM_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYwZGRiNTgzLTEzZTAtNDQyZS1hZTA0LTQ5ZmJjZTFmODhiYSJ9.djeA_RnaSvMyR9qYnz_2GW08jRq9aC5LG5bOEWdvBL4";

  const handlePersonaSelect = (persona: Persona) => {
    setSelectedPersona(persona);
    setChatMode(null);
  };

  const handleChatModeSelect = (mode: 'text' | 'voice') => {
    setChatMode(mode);
  };

  const handleClose = () => {
    setSelectedPersona(null);
    setChatMode(null);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        await handleSpeechToText(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast({
        title: "Recording Started",
        description: "Speak in Hindi...",
      });
    } catch (error: any) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleSpeechToText = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('file', audioBlob);
    formData.append('language_code', 'hi-IN');
    formData.append('model', 'saarika:v1');
    formData.append('with_timestamps', 'false');

    try {
      const response = await fetch('https://api.sarvam.ai/speech-to-text', {
        method: 'POST',
        headers: {
          'api-subscription-key': '044317b1-21ac-402f-9b65-1d98a3dcf2fd'
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Speech to text conversion failed');
      }

      const data = await response.json();
      setMessage(data.transcript);
      toast({
        title: "Speech Converted",
        description: "Your speech has been converted to text.",
      });
    } catch (error) {
      console.error('Speech to text error:', error);
      toast({
        title: "Error",
        description: "Failed to convert speech to text. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTextToSpeech = async (text: string, messageId: string) => {
    try {
      const chunks = text.match(/[^.!?]+[.!?]+/g) || [text];
      const validChunks = chunks.map(chunk => chunk.trim()).filter(chunk => chunk.length > 0);

      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
        audioRef.current = null;
      }

      setIsPlaying(messageId);

      for (const chunk of validChunks) {
        if (chunk.length > 500) {
          console.warn('Chunk too long, skipping:', chunk);
          continue;
        }

        console.log('Processing chunk:', chunk);
        const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/pFZP5JQG7iQjIQuC4Bku', {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': 'sk_e19c76f0f1e54e68677cf25fec734a202c3f99bca9e31add'
          },
          body: JSON.stringify({
            text: chunk,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75
            }
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Text-to-Speech API Error:', errorText);
          throw new Error(`TTS Error: ${errorText}`);
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        await new Promise((resolve, reject) => {
          audio.onended = () => {
            URL.revokeObjectURL(audioUrl);
            resolve(null);
          };
          audio.onerror = (e) => {
            console.error('Audio playback error:', e);
            URL.revokeObjectURL(audioUrl);
            reject(new Error('Audio playback failed'));
          };
          audio.play();
        });
      }

      setIsPlaying(null);

      toast({
        title: "Playing audio",
        description: "The message is being played...",
      });
    } catch (error: any) {
      console.error('Text-to-Speech Error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to play the message. Please try again.",
        variant: "destructive",
      });
      setIsPlaying(null);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(null);
    }
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

        {selectedPersona && !chatMode && (
          <ChatModeSelect
            onSelectMode={handleChatModeSelect}
            onClose={handleClose}
          />
        )}

        {selectedPersona && chatMode === 'voice' && (
          <VoiceChat
            persona={selectedPersona}
            onClose={() => setChatMode(null)}
          />
        )}

        {selectedPersona && chatMode === 'text' && (
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
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        {msg.role === 'assistant' ? (
                          <ReactMarkdown 
                            className="prose prose-sm max-w-none dark:prose-invert"
                          >
                            {msg.content}
                          </ReactMarkdown>
                        ) : (
                          msg.content
                        )}
                      </div>
                      {msg.role === 'assistant' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (isPlaying === `msg-${index}`) {
                              stopAudio();
                            } else {
                              handleTextToSpeech(msg.content, `msg-${index}`);
                            }
                          }}
                          className="flex-shrink-0"
                        >
                          <VolumeIcon 
                            className={`h-5 w-5 ${isPlaying === `msg-${index}` ? 'text-accent' : ''}`}
                          />
                        </Button>
                      )}
                    </div>
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
                <Button
                  variant={isRecording ? "destructive" : "secondary"}
                  onClick={isRecording ? stopRecording : startRecording}
                  className="w-12"
                >
                  {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
                <Button onClick={handleSendMessage}>Send</Button>
              </div>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  stopAudio();
                  setSelectedPersona(null);
                }}
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
