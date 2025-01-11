import { Button } from "@/components/ui/button";
import { MessageCircle, Mic } from "lucide-react";

interface ChatModeSelectProps {
  onSelectMode: (mode: 'text' | 'voice') => void;
  onClose: () => void;
}

const ChatModeSelect = ({ onSelectMode, onClose }: ChatModeSelectProps) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card p-6 rounded-xl shadow-lg max-w-md w-full space-y-6">
        <h2 className="text-2xl font-semibold text-center">Choose Chat Mode</h2>
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-32 flex flex-col gap-2"
            onClick={() => onSelectMode('text')}
          >
            <MessageCircle className="h-8 w-8" />
            <span>Text Chat</span>
          </Button>
          <Button
            variant="outline"
            className="h-32 flex flex-col gap-2"
            onClick={() => onSelectMode('voice')}
          >
            <Mic className="h-8 w-8" />
            <span>Voice Chat</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatModeSelect;