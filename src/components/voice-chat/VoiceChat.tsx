import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoiceChatProps {
  persona: {
    name: string;
    role: string;
    description: string;
  };
  onClose: () => void;
}

const VoiceChat = ({ persona, onClose }: VoiceChatProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const resetSilenceTimeout = () => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
    silenceTimeoutRef.current = setTimeout(() => {
      if (isRecording) {
        stopRecording();
      }
    }, 5000); // 5 seconds of silence triggers stop
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      // Set up audio context for silence detection
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      const analyzer = audioContextRef.current.createAnalyser();
      analyzer.fftSize = 2048;
      source.connect(analyzer);

      const bufferLength = analyzer.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      // Monitor audio levels for silence detection
      const checkAudioLevel = () => {
        if (!isRecording) return;
        
        analyzer.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / bufferLength;
        
        if (average > 5) { // Adjust threshold as needed
          resetSilenceTimeout();
        }
        
        requestAnimationFrame(checkAudioLevel);
      };

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        await handleSpeechToText(audioBlob);
        setIsProcessing(false);
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      checkAudioLevel();
      
      toast({
        title: "Recording Started",
        description: "Speak now... Recording will stop after 5 seconds of silence.",
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
      
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
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
      console.log('Transcript:', data.transcript);
      
      // Process the transcript with LLM and get response
      // For now, we'll use a mock response
      const mockResponse = `Hello! I heard you say: ${data.transcript}`;
      
      // Convert response to speech
      await handleTextToSpeech(mockResponse);
      
      toast({
        title: "Message Processed",
        description: "Processing your message...",
      });
    } catch (error) {
      console.error('Speech to text error:', error);
      toast({
        title: "Error",
        description: "Failed to process speech. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTextToSpeech = async (text: string) => {
    try {
      const chunks = text.match(/[^.!?]+[.!?]+/g) || [text];
      const validChunks = chunks.map(chunk => chunk.trim()).filter(chunk => chunk.length > 0);

      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
        audioRef.current = null;
      }

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

      toast({
        title: "Playing Response",
        description: "Listen to the response...",
      });
    } catch (error: any) {
      console.error('Text-to-Speech Error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to play the response. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card p-6 rounded-xl shadow-lg max-w-md w-full space-y-6 relative">
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute right-4 top-4"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="w-32 h-32">
              <AvatarImage src="/placeholder.svg" alt={persona.name} />
              <AvatarFallback>{persona.name[0]}</AvatarFallback>
            </Avatar>
            <div className={`absolute inset-0 -z-10 animate-pulse ${isRecording ? 'opacity-100' : 'opacity-0'}`}>
              <div className="absolute inset-0 rounded-full bg-accent/20 scale-110" />
              <div className="absolute inset-0 rounded-full bg-accent/10 scale-125" />
              <div className="absolute inset-0 rounded-full bg-accent/5 scale-150" />
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-semibold">{persona.name}</h2>
            <p className="text-muted-foreground">{persona.role}</p>
          </div>

          <Button
            size="lg"
            variant={isRecording ? "destructive" : "default"}
            className="rounded-full w-16 h-16"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
          >
            {isRecording ? (
              <MicOff className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </Button>

          <p className="text-sm text-muted-foreground">
            {isRecording ? "Recording will stop after 5 seconds of silence" : "Click to start recording"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoiceChat;