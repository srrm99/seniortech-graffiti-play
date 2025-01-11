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
    prompt: 'Write a very short story in English (maximum 2 paragraphs) with a clear moral lesson that seniors can relate to. Focus on family values or kindness. Keep it brief and engaging.'
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
          <h1 className="text-4xl font-rozha text-accent">Daily Readings</h1>
          <div className="w-10" />
        </div>

        {!selectedType && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {readingTypes.map((type) => (
              <Card
                key={type.id}
                className="cursor-pointer hover:border-accent transition-colors"
                onClick={() => generateReadings(type)}
              >
                <CardContent className="p-6">
                  <h3 className="text-2xl font-rozha text-accent mb-2">{type.title}</h3>
                  <p className="text-muted-foreground">{type.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedType && readings.length > 0 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-rozha text-accent">{selectedType.title}</h2>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedType(null);
                  setReadings([]);
                  setCurrentIndex(0);
                }}
              >
                Choose Different Type
              </Button>
            </div>

            <div className="bg-accent/10 p-4 rounded-lg flex items-center justify-center gap-2 text-lg">
              <MoveHorizontal className="w-6 h-6" />
              <p>Swipe left or right to read more stories</p>
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
                  <Card className="w-full h-full overflow-y-auto">
                    <CardContent className="p-6 prose prose-lg dark:prose-invert">
                      <ReactMarkdown>{readings[currentIndex]}</ReactMarkdown>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>

              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full bg-white/90 hover:bg-white"
                  onClick={swipeRight}
                  disabled={currentIndex === 0}
                >
                  <span className="sr-only">Previous</span>
                  ←
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full bg-white/90 hover:bg-white"
                  onClick={swipeLeft}
                  disabled={currentIndex === readings.length - 1}
                >
                  <span className="sr-only">Next</span>
                  →
                </Button>
              </div>

              <div className="absolute top-4 left-0 right-0 flex justify-center">
                <div className="bg-white/90 px-3 py-1 rounded-full text-sm">
                  {currentIndex + 1} / {readings.length}
                </div>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="text-center p-12">
            <div className="animate-pulse text-xl font-rozha text-accent">
              Generating your readings...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnglishReadings;
