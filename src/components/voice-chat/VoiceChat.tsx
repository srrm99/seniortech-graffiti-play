import { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Room,
  RoomEvent,
  LocalParticipant,
  RemoteParticipant,
  createLocalAudioTrack
} from 'livekit-client';

interface VoiceChatProps {
  persona: {
    name: string;
    role: string;
    description: string;
  };
  onClose: () => void;
}

const VoiceChat = ({ persona, onClose }: VoiceChatProps) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, [room]);

  const connectToRoom = async () => {
    try {
      setIsConnecting(true);
      // Initialize room with the correct configuration
      const newRoom = new Room({
        adaptiveStream: true,
        dynacast: true,
        publishDefaults: {
          simulcast: true,
        },
      });

      // Connect to LiveKit server with proper URL and token
      // Note: You'll need to set up a LiveKit server and generate tokens
      const wsUrl = 'wss://your-livekit-server.com';  // Replace with your LiveKit server URL
      const token = 'your-token-here'; // Replace with your token generation logic
      
      await newRoom.connect(wsUrl, token);
      
      // Enable local audio
      const audioTrack = await createLocalAudioTrack({
        echoCancellation: true,
        noiseSuppression: true,
      });
      await newRoom.localParticipant.publishTrack(audioTrack);

      // Set up event listeners with persona-specific handling
      newRoom.on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
        console.log('Participant connected:', participant.identity);
        toast({
          title: `${persona.name} Connected`,
          description: `${persona.name} is ready to chat with you.`,
        });
      });

      newRoom.on(RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => {
        console.log('Participant disconnected:', participant.identity);
        toast({
          title: `${persona.name} Disconnected`,
          description: `${persona.name} has left the conversation.`,
        });
      });

      // Handle audio data for AI processing
      newRoom.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
        if (track.kind === 'audio') {
          // Here you would implement the logic to process the audio with your AI model
          console.log('Audio track subscribed:', track.sid);
        }
      });

      setRoom(newRoom);
      setIsConnected(true);
      
      toast({
        title: "Connected",
        description: `Voice chat with ${persona.name} is now active.`,
      });
    } catch (error: any) {
      console.error('Failed to connect to room:', error);
      toast({
        title: "Connection Error",
        description: error.message || "Failed to connect to voice chat.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectFromRoom = async () => {
    if (room) {
      await room.disconnect();
      setRoom(null);
      setIsConnected(false);
      toast({
        title: "Disconnected",
        description: `Voice chat with ${persona.name} has ended.`,
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
            <div className={`absolute inset-0 -z-10 animate-pulse ${isConnected ? 'opacity-100' : 'opacity-0'}`}>
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
            variant={isConnected ? "destructive" : "default"}
            className="rounded-full w-16 h-16"
            onClick={isConnected ? disconnectFromRoom : connectToRoom}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <span className="animate-spin">⚪</span>
            ) : isConnected ? (
              "End"
            ) : (
              "Start"
            )}
          </Button>

          <p className="text-sm text-muted-foreground">
            {isConnecting ? "Connecting..." : isConnected ? "Voice chat is active" : "Click to start voice chat"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoiceChat;