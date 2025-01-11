import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Mic, MicOff, VolumeIcon } from "lucide-react";
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
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePersonaSelect = (persona: Persona) => {
    setSelectedPersona(persona);
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
    } catch (error) {
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
        if (chunk.length > 500) continue;

        const response = await fetch('https://api.sarvam.ai/text-to-speech', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-subscription-key': '044317b1-21ac-402f-9b65-1d98a3dcf2fd'
          },
          body: JSON.stringify({
            inputs: [chunk],
            language_code: 'hi-IN',
            target_language_code: 'hi-IN',
            model: 'saarika:v1'
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Text to speech error response:', errorText);
          throw new Error(`API Error: ${errorText}`);
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        await new Promise((resolve) => {
          audio.onended = () => {
            URL.revokeObjectURL(audioUrl);
            resolve(null);
          };
          audio.play();
        });
      }

      setIsPlaying(null);
      toast({
        title: "Playing audio",
        description: "The message is being played...",
      });
    } catch (error) {
      console.error('Text to speech error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to play the message. Please try again.",
        variant: "destructive",
      });
      setIsPlaying(null);
    }
  };

  return (
    <div className="min-h-screen bg-pattern p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/home')} className="text-accent">
            <ArrowLeft className="w-6 h-6 mr-2" />
            Back
          </button>
          <h1 className="text-4xl">Talk to Someone</h1>
        </div>

        {selectedPersona ? (
          <div>
            {/* Conversation Section */}
          </div>
        ) : (
          <div>
            {/* Persona Selection */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Companions;
