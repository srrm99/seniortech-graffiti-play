import { useState, useRef } from 'react';
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
  const { toast } = useToast();

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
        setIsProcessing(true);
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        await handleSpeechToText(audioBlob);
        setIsProcessing(false);
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast({
        title: "Recording Started",
        description: "Speak now...",
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
      // Here you would typically send the transcript to your AI service
      // and get a response back to convert to speech
      console.log('Transcript:', data.transcript);
      
      toast({
        title: "Message Received",
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
            {isRecording ? "Click to stop recording" : "Click to start recording"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoiceChat;