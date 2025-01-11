import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MoveHorizontal } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';

type ReadingType = {
  id: string;
  title: string;
  description: string;
  prompt: string;
};

const readingTypes: ReadingType[] = [
  {
    id: 'devotional',
    title: 'Daily Devotional',
    description: 'Daily spiritual readings and reflections',
    prompt: 'Generate a brief, 2-paragraph devotional reading in English about faith and hope. Include one short reflection question at the end. Keep it simple and uplifting.'
  },
  {
    id: 'motivational',
    title: 'Motivational',
    description: 'Inspiring stories and thoughts',
    prompt: 'Create a short motivational message in English (2-3 paragraphs) with a simple inspiring message about staying positive. Include one practical tip.'
  },
  {
    id: 'story',
    title: 'Story',
    description: 'Meaningful short stories',
    prompt: 'Write a very short story in English (maximum 3 paragraphs) with a clear moral lesson that seniors can relate to. Focus on family, friendship, or kindness.'
  },
  {
    id: 'wisdom',
    title: 'Daily Wisdom',
    description: 'Practical wisdom for daily life',
    prompt: 'Share one piece of practical wisdom in English (1-2 paragraphs) drawing from traditional values. Keep it concise and actionable.'
  }
];

const EnglishReadings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<ReadingType | null>(null);
  const [readings, setReadings] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const LOCAL_LLM_URL = "https://johnaic.pplus.ai/openai/chat/completions";
  const LOCAL_LLM_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYwZGRiNTgzLTEzZTAtNDQyZS1hZTA0LTQ5ZmJjZTFmODhiYSJ9.djeA_RnaSvMyR9qYnz_2GW08jRq9aC5LG5bOEWdvBL4";

  const generateReadings = async (readingType: ReadingType) => {
    setIsLoading(true);
    setSelectedType(readingType);

    try {
      const readingPromises = Array(5).fill(null).map(async () => {
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
                content: readingType.prompt
              }
            ],
            stream: false,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
      });

      const generatedReadings = await Promise.all(readingPromises);
      setReadings(generatedReadings);
    } catch (error: any) {
      console.error('Error generating readings:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to generate readings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 100;
    if (Math.abs(info.offset.x) > swipeThreshold) {
      if (info.offset.x > 0 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      } else if (info.offset.x < 0 && currentIndex < readings.length - 1) {
        setCurrentIndex(prev => prev + 1);
      }
    }
  };

  const swipeLeft = () => {
    if (currentIndex < readings.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const swipeRight = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#D3E4FD] p-6 font-poppins">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/home')}
            className="flex items-center text-[#1EAEDB] hover:text-[#33C3F0] transition-colors"
          >
            <ArrowLeft className="w-8 h-8 mr-2" />
            <span className="text-xl">Back</span>
          </button>
          <h1 className="text-4xl font-bold text-[#1EAEDB]">Daily Readings</h1>
          <div className="w-10" />
        </div>

        {!selectedType && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {readingTypes.map((type) => (
              <Card
                key={type.id}
                className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-[#33C3F0] bg-white"
                onClick={() => generateReadings(type)}
              >
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-[#1EAEDB] mb-3">{type.title}</h3>
                  <p className="text-lg text-gray-600">{type.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedType && readings.length > 0 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#1EAEDB]">{selectedType.title}</h2>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedType(null);
                  setReadings([]);
                  setCurrentIndex(0);
                }}
                className="text-lg border-2 border-[#33C3F0] hover:bg-[#33C3F0] hover:text-white transition-colors"
              >
                Choose Different Type
              </Button>
            </div>

            <div className="bg-[#33C3F0]/20 p-6 rounded-lg flex items-center justify-center gap-3 text-xl shadow-md">
              <MoveHorizontal className="w-8 h-8 text-[#1EAEDB]" />
              <p className="text-[#1EAEDB] font-medium">Swipe left or right to read more stories</p>
            </div>

            <div className="relative h-[500px] w-full overflow-hidden touch-none">
              <AnimatePresence initial={false}>
                <motion.div
                  key={currentIndex}
                  className="absolute w-full h-full"
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={handleDragEnd}
                  whileDrag={{ scale: 1.05 }}
                >
                  <Card className="w-full h-full overflow-y-auto bg-white shadow-xl">
                    <CardContent className="p-8 prose prose-lg dark:prose-invert max-w-none">
                      <ReactMarkdown>{readings[currentIndex]}</ReactMarkdown>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>

              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-6">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-16 h-16 rounded-full bg-white/90 hover:bg-[#33C3F0] hover:text-white border-2 border-[#33C3F0] text-2xl"
                  onClick={swipeRight}
                  disabled={currentIndex === 0}
                >
                  ←
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-16 h-16 rounded-full bg-white/90 hover:bg-[#33C3F0] hover:text-white border-2 border-[#33C3F0] text-2xl"
                  onClick={swipeLeft}
                  disabled={currentIndex === readings.length - 1}
                >
                  →
                </Button>
              </div>

              <div className="absolute top-4 left-0 right-0 flex justify-center">
                <div className="bg-white/90 px-4 py-2 rounded-full text-lg font-medium text-[#1EAEDB] shadow-md">
                  {currentIndex + 1} / {readings.length}
                </div>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="text-center p-12">
            <div className="animate-pulse text-2xl font-bold text-[#1EAEDB]">
              Generating your readings...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnglishReadings;
