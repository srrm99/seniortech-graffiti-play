import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
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
    title: 'Devotional',
    description: 'Daily spiritual readings and reflections',
    prompt: 'Generate an inspiring devotional reading about faith, hope, and spiritual growth. Include a short reflection question at the end.'
  },
  {
    id: 'motivational',
    title: 'Motivational',
    description: 'Uplifting stories and quotes to inspire',
    prompt: 'Create a motivational reading with an inspiring real-life story and a powerful message about perseverance and growth.'
  },
  {
    id: 'story',
    title: 'Story',
    description: 'Engaging short stories with meaning',
    prompt: 'Write a heartwarming short story with moral values and life lessons that seniors can relate to.'
  },
  {
    id: 'wisdom',
    title: 'Daily Wisdom',
    description: 'Practical wisdom for everyday life',
    prompt: 'Share a piece of practical wisdom or life advice, drawing from traditional knowledge and modern insights.'
  }
];

const DailyReadings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<ReadingType | null>(null);
  const [readings, setReadings] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const LOCAL_LLM_URL = "https://johnaic.pplus.ai/openai/chat/completions";
  const LOCAL_LLM_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYwZGRiNTgzLTEzZTAtNDQyZS1hZTA0LTQ5ZmJjZTFmODhiYSJ9.djeA_RnaSvMyR9qYnz_2GW08jRq9aC5LG5bOEWdvBL4";

  const generateReadings = async (readingType: ReadingType) => {
    setIsLoading(true);
    setSelectedType(readingType);

    try {
      // Generate 5 readings for the carousel
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
                }}
              >
                Choose Different Type
              </Button>
            </div>

            <Carousel className="w-full">
              <CarouselContent>
                {readings.map((reading, index) => (
                  <CarouselItem key={index}>
                    <Card className="p-6">
                      <CardContent className="prose prose-lg dark:prose-invert">
                        <ReactMarkdown>{reading}</ReactMarkdown>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
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

export default DailyReadings;